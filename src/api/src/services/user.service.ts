// Service para logica de negocio de usuarios

import { UserRepository, UserRow, UpdateUserData } from '../repositories/user.repository';
import { hashPassword, verifyPassword, signJWT } from '../lib/jwt';
import { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError, 
  ConflictError 
} from '../lib/errors';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  plan: string;
  notificationsEnabled: boolean;
  dailySummaryEnabled: boolean;
  dailySummaryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDTO {
  email: string;
  name: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  user: UserDTO;
  token: string;
}

// Converter row do banco para DTO
function toDTO(row: UserRow): UserDTO {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan,
    notificationsEnabled: row.notifications_enabled === 1,
    dailySummaryEnabled: row.daily_summary_enabled === 1,
    dailySummaryTime: row.daily_summary_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Gerar ID unico
function generateId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

export class UserService {
  constructor(
    private repository: UserRepository,
    private jwtSecret: string
  ) {}

  async register(data: RegisterDTO): Promise<AuthResult> {
    // Validar email
    if (!data.email || !data.email.includes('@')) {
      throw new BadRequestError('Email invalido');
    }

    // Validar senha
    if (!data.password || data.password.length < 8) {
      throw new BadRequestError('Senha deve ter pelo menos 8 caracteres');
    }

    // Validar nome
    if (!data.name || data.name.trim().length < 2) {
      throw new BadRequestError('Nome deve ter pelo menos 2 caracteres');
    }

    // Verificar se email ja existe
    const existing = await this.repository.findByEmail(data.email.toLowerCase());
    if (existing) {
      throw new ConflictError('Email ja cadastrado');
    }

    // Hash da senha
    const passwordHash = await hashPassword(data.password);

    // Criar usuario
    const userRow = await this.repository.create({
      id: generateId(),
      email: data.email.toLowerCase(),
      name: data.name.trim(),
      passwordHash,
    });

    const user = toDTO(userRow);

    // Gerar token
    const token = await signJWT(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      this.jwtSecret
    );

    return { user, token };
  }

  async login(data: LoginDTO): Promise<AuthResult> {
    // Validar dados
    if (!data.email || !data.password) {
      throw new BadRequestError('Email e senha sao obrigatorios');
    }

    // Buscar usuario
    const userRow = await this.repository.findByEmail(data.email.toLowerCase());
    if (!userRow) {
      throw new UnauthorizedError('Credenciais invalidas');
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(data.password, userRow.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciais invalidas');
    }

    const user = toDTO(userRow);

    // Gerar token
    const token = await signJWT(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      this.jwtSecret
    );

    return { user, token };
  }

  async getById(id: string): Promise<UserDTO> {
    const userRow = await this.repository.findById(id);
    if (!userRow) {
      throw new NotFoundError('Usuario');
    }
    return toDTO(userRow);
  }

  async update(id: string, data: UpdateUserData): Promise<UserDTO> {
    const userRow = await this.repository.update(id, data);
    if (!userRow) {
      throw new NotFoundError('Usuario');
    }
    return toDTO(userRow);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Usuario');
    }
  }
}
