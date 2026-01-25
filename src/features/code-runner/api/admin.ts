/**
 * 管理接口 - API 服务
 */

import axiosInstance from '@/lib/axios';
import type {
  AdminScriptDetail,
  CreateScriptRequest,
  UpdateScriptRequest,
} from '../types/admin';

/** API 响应结构 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const BASE_PATH = '/code-runner/admin';

export const adminApi = {
  /** 获取所有脚本（管理端） */
  getScripts: async (): Promise<AdminScriptDetail[]> => {
    const response = await axiosInstance.get<ApiResponse<AdminScriptDetail[]>>(
      '/code-runner/scripts'
    );
    return response.data.data;
  },

  /** 获取单个脚本详情（管理端，包含 scriptContent） */
  getScript: async (id: string): Promise<AdminScriptDetail | null> => {
    const response = await axiosInstance.get<ApiResponse<AdminScriptDetail>>(
      `/code-runner/scripts/${id}`
    );
    return response.data.data;
  },

  /** 创建脚本 */
  createScript: async (data: CreateScriptRequest): Promise<AdminScriptDetail> => {
    const response = await axiosInstance.post<ApiResponse<AdminScriptDetail>>(
      `${BASE_PATH}/scripts`,
      data
    );
    return response.data.data;
  },

  /** 更新脚本 */
  updateScript: async (id: string, data: UpdateScriptRequest): Promise<AdminScriptDetail> => {
    const response = await axiosInstance.put<ApiResponse<AdminScriptDetail>>(
      `${BASE_PATH}/scripts/${id}`,
      data
    );
    return response.data.data;
  },

  /** 删除脚本 */
  deleteScript: async (id: string): Promise<void> => {
    await axiosInstance.delete<ApiResponse<null>>(`${BASE_PATH}/scripts/${id}`);
  },
};
