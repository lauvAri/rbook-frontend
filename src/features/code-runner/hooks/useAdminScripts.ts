/**
 * 管理接口 - React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import type {
  AdminScriptDetail,
  CreateScriptRequest,
  UpdateScriptRequest,
} from '../types/admin';

const QUERY_KEYS = {
  scripts: ['admin', 'scripts'] as const,
  script: (id: string) => ['admin', 'scripts', id] as const,
};

/** 获取所有脚本列表 */
export function useAdminScripts() {
  return useQuery<AdminScriptDetail[], Error>({
    queryKey: QUERY_KEYS.scripts,
    queryFn: adminApi.getScripts,
  });
}

/** 获取单个脚本详情 */
export function useAdminScript(id: string) {
  return useQuery<AdminScriptDetail | null, Error>({
    queryKey: QUERY_KEYS.script(id),
    queryFn: () => adminApi.getScript(id),
    enabled: !!id,
  });
}

/** 创建脚本 */
export function useCreateScript() {
  const queryClient = useQueryClient();

  return useMutation<AdminScriptDetail, Error, CreateScriptRequest>({
    mutationFn: adminApi.createScript,
    onSuccess: () => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scripts });
      // 同时刷新用户端的脚本列表
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}

/** 更新脚本 */
export function useUpdateScript() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminScriptDetail,
    Error,
    { id: string; data: UpdateScriptRequest }
  >({
    mutationFn: ({ id, data }) => adminApi.updateScript(id, data),
    onSuccess: (_, { id }) => {
      // 更新成功后刷新列表和详情
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scripts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.script(id) });
      // 同时刷新用户端的脚本列表和详情
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      queryClient.invalidateQueries({ queryKey: ['script', id] });
    },
  });
}

/** 删除脚本 */
export function useDeleteScript() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: adminApi.deleteScript,
    onSuccess: () => {
      // 删除成功后刷新列表
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scripts });
      // 同时刷新用户端的脚本列表
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}
