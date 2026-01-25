/**
 * 用户模块类型定义
 */

// 用户类型
export type UserType = 'ADMIN' | 'WORKER';

// 用户信息
export interface User {
  id: number;
  username: string;
  userType: UserType;
  token?: string;
  createdAt: string;
  updatedAt: string;
}

// 验证码响应
export interface CaptchaResponse {
  captchaKey: string;
  captchaImage: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
}

// 注册请求
export interface RegisterRequest {
  username: string;
  password: string;
  userType: UserType;
}

// 批量导入用户请求
export interface BatchImportRequest {
  users: Array<{
    username: string;
    password?: string;
  }>;
}

// 批量导入结果项
export interface BatchImportResultItem {
  username: string;
  success: boolean;
  userId: number | null;
  password: string | null;
  message: string | null;
}

// 批量导入响应
export interface BatchImportResponse {
  total: number;
  successCount: number;
  failedCount: number;
  results: BatchImportResultItem[];
}

// 重置密码响应
export interface ResetPasswordResponse {
  userId: number;
  username: string;
  newPassword: string;
}

// 操作日志
export interface OperationLog {
  id: number;
  userId: number;
  operationType: string;
  operationDesc: string;
  scriptId: string | null;
  createdAt: string;
}

// 分页日志响应
export interface PaginatedLogsResponse {
  content: OperationLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
