import type { Env } from '../types/env';
import { TermsRepository } from '../repositories/terms.repository';
import { HttpError } from '../lib/http';

export class TermsService {
  constructor(private env: Env, private termsRepo: TermsRepository) {}

  currentTerms() {
    return {
      versao_termos: this.env.TERMS_VERSION || 'v1',
      aviso_delay: 'O sistema é informativo e pode ter atraso de 5 a 15 minutos (ou mais) nas cotações e alertas.',
      contato: this.env.CONTACT_EMAIL || null
    };
  }

  async acceptTerms(
    userId: string,
    input: {
      versao_termos?: string;
      aceito: boolean;
      ip?: string | null;
      user_agent?: string | null;
      observacoes?: string | null;
    }
  ) {
    if (!input.aceito) {
      throw new HttpError(400, 'Você precisa aceitar os termos.');
    }

    const currentVersion = this.env.TERMS_VERSION || 'v1';
    const version = input.versao_termos ?? currentVersion;

    // opcional (recomendado): impedir aceitar versão diferente da atual
    if (version !== currentVersion) {
      throw new HttpError(409, 'Versão dos termos desatualizada. Atualize e tente novamente.');
    }

    await this.termsRepo.recordAcceptance(userId, version, {
      ip: input.ip ?? undefined,
      userAgent: input.user_agent ?? undefined,
      observacoes: input.observacoes ?? undefined
    });
  }
}
