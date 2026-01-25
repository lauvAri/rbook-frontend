/**
 * 用户本人修改密码
 */
export async function changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
  await axios.put<ApiResponse<null>>(`/user/${userId}/change-password`, {
    oldPassword,
    newPassword,
  });
}
/**
 * 用户模块 API 接口
 */

import axios from '@/lib/axios';
import type {
  User,
  CaptchaResponse,
  LoginRequest,
  RegisterRequest,
  BatchImportRequest,
  BatchImportResponse,
  ResetPasswordResponse,
  OperationLog,
  PaginatedLogsResponse,
} from '../types';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取图片验证码
 */
export async function getCaptcha(): Promise<CaptchaResponse> {
  const response = await axios.get<ApiResponse<CaptchaResponse>>('/captcha');
  return response.data.data;
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<User> {
  const response = await axios.post<ApiResponse<User>>('/user/login', data);
  return response.data.data;
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  await axios.post<ApiResponse<null>>('/user/logout');
}

/**
 * 注册新用户
 */
export async function register(data: RegisterRequest): Promise<User> {
  const response = await axios.post<ApiResponse<User>>('/user/register', data);
  return response.data.data;
}

/**
 * 批量导入用户
 */
export async function batchImportUsers(
  data: BatchImportRequest
): Promise<BatchImportResponse> {
  const response = await axios.post<ApiResponse<BatchImportResponse>>(
    '/user/batch-import',
    data
  );
  return response.data.data;
}

/**
 * 重置用户密码
 */
export async function resetPassword(userId: number): Promise<ResetPasswordResponse> {
  const response = await axios.put<ApiResponse<ResetPasswordResponse>>(
    `/user/${userId}/reset-password`
  );
  return response.data.data;
}

/**
 * 获取用户列表
 */
export async function getUserList(): Promise<User[]> {
  const response = await axios.get<ApiResponse<User[]>>('/user/list');
  return response.data.data;
}

/**
 * 获取单个用户信息
 */
export async function getUser(userId: number): Promise<User> {
  const response = await axios.get<ApiResponse<User>>(`/user/${userId}`);
  return response.data.data;
}

/**
 * 删除用户
 */
export async function deleteUser(userId: number): Promise<void> {
  await axios.delete<ApiResponse<null>>(`/user/${userId}`);
}

/**
 * 获取指定用户的操作日志
 */
export async function getUserLogs(userId: number): Promise<OperationLog[]> {
  const response = await axios.get<ApiResponse<OperationLog[]>>(
    `/user/${userId}/logs`
  );
  return response.data.data;
}

/**
 * 获取所有操作日志（分页）
 */
export async function getAllLogs(
  page: number = 0,
  size: number = 20
): Promise<PaginatedLogsResponse> {
  const response = await axios.get<ApiResponse<PaginatedLogsResponse>>(
    '/user/logs',
    { params: { page, size } }
  );
  return response.data.data;
}
