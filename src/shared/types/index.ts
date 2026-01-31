// ====================================
// ENUMS
// ====================================

export enum UserPlan {
  FREE = "FREE",
  INTERMEDIATE = "INTERMEDIATE",
  GOLD = "GOLD",
}

export enum AlertCondition {
  ABOVE = "ABOVE",
  BELOW = "BELOW",
}

export enum AlertStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  TRIGGERED = "TRIGGERED",
}

export enum NotificationChannel {
  PUSH = "PUSH",
  EMAIL = "EMAIL",
}

export enum JobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum AssetType {
  STOCK = "STOCK",
  FII = "FII",
  CRYPTO = "CRYPTO",
}

// ====================================
// ENTITIES
// ====================================

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  plan: UserPlan;
  notificationsEnabled: boolean;
  dailySummaryEnabled: boolean;
  dailySummaryTime: string; // HH:mm format
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  lastPrice: number;
  priceUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Watchlist {
  id: string;
  userId: string;
  assetId: string;
  createdAt: Date;
}

export interface PriceAlert {
  id: string;
  userId: string;
  assetId: string;
  condition: AlertCondition;
  targetPrice: number;
  status: AlertStatus;
  lastTriggeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertHistory {
  id: string;
  alertId: string;
  userId: string;
  assetId: string;
  ticker: string;
  condition: AlertCondition;
  targetPrice: number;
  triggeredPrice: number;
  triggeredAt: Date;
  notificationSent: boolean;
  notificationChannel: NotificationChannel;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: Date;
}

export interface DailySummary {
  id: string;
  userId: string;
  headlines: NewsHeadline[];
  sentAt: Date | null;
  createdAt: Date;
}

export interface NewsHeadline {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: Date;
  relatedTickers: string[];
}

export interface JobLog {
  id: string;
  jobName: string;
  status: JobStatus;
  message: string;
  metadata: Record<string, unknown>;
  startedAt: Date;
  completedAt: Date | null;
}

// ====================================
// DTOs (Data Transfer Objects)
// ====================================

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateAlertDTO {
  assetId: string;
  condition: AlertCondition;
  targetPrice: number;
}

export interface UpdateAlertDTO {
  condition?: AlertCondition;
  targetPrice?: number;
  status?: AlertStatus;
}

// ====================================
// API RESPONSES
// ====================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ====================================
// PLAN LIMITS
// ====================================

export const PLAN_LIMITS: Record<UserPlan, { maxAssets: number; hasAds: boolean }> = {
  [UserPlan.FREE]: { maxAssets: 2, hasAds: true },
  [UserPlan.INTERMEDIATE]: { maxAssets: 6, hasAds: false },
  [UserPlan.GOLD]: { maxAssets: 20, hasAds: false },
};
