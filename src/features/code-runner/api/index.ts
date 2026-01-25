/**
 * 代码执行器 - API 服务
 */

import axiosInstance from '@/lib/axios';
import type { CodeScript, ExecuteCodeRequest, ExecuteCodeResponse } from '../types';

/** API 响应结构 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const BASE_PATH = '/code-runner';

export const codeRunnerApi = {
  /** 获取所有可用脚本 */
  getScripts: async (): Promise<CodeScript[]> => {
    const response = await axiosInstance.get<ApiResponse<CodeScript[]>>(`${BASE_PATH}/scripts`);
    return response.data.data;
  },

  /** 获取单个脚本详情 */
  getScript: async (scriptId: string): Promise<CodeScript | null> => {
    const response = await axiosInstance.get<ApiResponse<CodeScript>>(`${BASE_PATH}/scripts/${scriptId}`);
    return response.data.data;
  },

  /** 执行代码 */
  execute: async (request: ExecuteCodeRequest): Promise<ExecuteCodeResponse> => {
    const response = await axiosInstance.post<ApiResponse<ExecuteCodeResponse>>(
      `${BASE_PATH}/execute`,
      request,
      { timeout: 30000 } // R 脚本执行可能需要较长时间
    );
    return response.data.data;
  },
};

export type { CodeScript, ExecuteCodeRequest, ExecuteCodeResponse };
