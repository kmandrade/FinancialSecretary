import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";
import { ZodError } from "zod";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso nao encontrado") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Requisicao invalida") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Nao autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acesso negado") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflito de dados") {
    super(message, 409);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log do erro
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Erro de validacao Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Erro de validacao",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Erro operacional conhecido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Erro desconhecido
  return res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Rota ${req.method} ${req.path} nao encontrada`,
  });
};
