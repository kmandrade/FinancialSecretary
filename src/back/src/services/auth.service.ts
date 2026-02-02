import type { Env } from '../types/env';
import { signAccessToken } from '../lib/jwt';
import { ValidationError } from '../lib/errors';
import { hashPassword, verifyPassword } from '../lib/password';
import { UserRepository, type UserRow } from '../repositories/user.repository';
import { PreferencesRepository } from '../repositories/preferences.repository';
import { TermsRepository } from '../repositories/terms.repository';
import { PlanRepository } from '../repositories/plan.repository';
import { PasswordResetRepository } from '../repositories/password_reset.repository';
import { EmailService } from './email.service';

export class AuthService {
  constructor(
    private readonly env: Env,
    private readonly users: UserRepository,
    private readonly prefs: PreferencesRepository,
    private readonly terms: TermsRepository,
    private readonly plans: PlanRepository,
    private readonly resetRepo: PasswordResetRepository,
    private readonly email: EmailService
  ) {}

  private async issueToken(user: Pick<UserRow, 'id' | 'perfil' | 'email' | 'nome'>) {
    const secret = this.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    return signAccessToken(
      { sub: user.id, perfil: user.perfil as any, email: user.email, nome: user.nome },
      secret,
      this.env.JWT_ISSUER || 'financial-secretary'
    );
  }

  async register(params: {
    email: string;
    senha: string;
    nome: string;
    termos_versao?: string | null;
    termos_aceito?: boolean;
    ip?: string | null;
    user_agent?: string | null;
  }): Promise<{ user: Omit<UserRow, 'hash_senha'>; token: string }> {
    const email = params.email.trim().toLowerCase();
    const existing = await this.users.getByEmail(email);
    if (existing && !existing.excluido_em) throw new ValidationError('Email já cadastrado');

    const hash = await hashPassword(params.senha);
    const userId = crypto.randomUUID();

    await this.users.create({ id: userId, email, hash_senha: hash, nome: params.nome });
    await this.prefs.ensureForUser(userId);
    await this.plans.ensureDefaultPlanForUser(userId);

    if (params.termos_versao && params.termos_aceito) {
      await this.terms.setAccepted({
        usuario_id: userId,
        versao_termos: params.termos_versao,
        ip: params.ip ?? null,
        user_agent: params.user_agent ?? null,
      });
    }

    const user = await this.users.getById(userId);
    if (!user) throw new Error('Falha ao criar usuário');

    const token = await this.issueToken(user);
    const { hash_senha, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async login(params: { email: string; senha: string }): Promise<{ user: Omit<UserRow, 'hash_senha'>; token: string }> {
    const email = params.email.trim().toLowerCase();
    const user = await this.users.getByEmail(email);
    if (!user || user.excluido_em) throw new ValidationError('Credenciais inválidas');

    const ok = await verifyPassword(params.senha, user.hash_senha);
    if (!ok) throw new ValidationError('Credenciais inválidas');

    const token = await this.issueToken(user);
    const { hash_senha, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async forgotPassword(params: { email: string; resetUrlBase: string }): Promise<{ ok: true; token_dev?: string }> {
    const email = params.email.trim().toLowerCase();
    const user = await this.users.getByEmail(email);

    // Sempre retorna OK para não vazar se existe usuário
    if (!user || user.excluido_em) return { ok: true };

    await this.resetRepo.revokeAllForUser(user.id);
    const created = await this.resetRepo.create(user.id, { expiresMinutes: 60 });

    const resetUrl = `${params.resetUrlBase.replace(/\/$/, '')}?token=${encodeURIComponent(created.token)}`;

    // Se email não estiver configurado, em DEV devolvemos o token para teste.
    const hasEmail = !!this.env.RESEND_API_KEY && !!this.env.EMAIL_FROM;
    if (hasEmail) {
      await this.email.sendPasswordReset({
        to: user.email,
        userName: user.nome,
        resetUrl,
      });
      return { ok: true };
    }

    if ((this.env.ENV || 'dev') !== 'production') return { ok: true, token_dev: created.token };
    return { ok: true };
  }

  async resetPassword(params: { token: string; newPassword: string }): Promise<{ ok: true }> {
    const row = await this.resetRepo.getValidByToken(params.token);
    if (!row) throw new ValidationError('Token inválido ou expirado');

    const hash = await hashPassword(params.newPassword);
    await this.users.updatePassword(row.usuario_id, hash);
    await this.resetRepo.markUsed(row.id);
    return { ok: true };
  }
}
