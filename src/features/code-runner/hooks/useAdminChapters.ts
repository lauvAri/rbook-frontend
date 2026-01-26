/**
 * 章节管理接口 - React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import { codeRunnerKeys } from './useCodeRunner';
import type {
  AdminChapter,
  CreateChapterRequest,
  UpdateChapterRequest,
} from '../types/admin';

const QUERY_KEYS = {
  chapters: ['admin', 'chapters'] as const,
};

/** 获取章节列表 */
export function useAdminChapters() {
  return useQuery<AdminChapter[], Error>({
    queryKey: QUERY_KEYS.chapters,
    queryFn: adminApi.getChapters,
  });
}

/** 创建章节 */
export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation<AdminChapter, Error, CreateChapterRequest>({
    mutationFn: adminApi.createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chapters });
      queryClient.invalidateQueries({ queryKey: codeRunnerKeys.chapters() });
    },
  });
}

/** 更新章节 */
export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation<
    AdminChapter,
    Error,
    { id: number; data: UpdateChapterRequest }
  >({
    mutationFn: ({ id, data }) => adminApi.updateChapter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chapters });
      queryClient.invalidateQueries({ queryKey: codeRunnerKeys.chapters() });
    },
  });
}

/** 删除章节 */
export function useDeleteChapter() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: adminApi.deleteChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chapters });
      queryClient.invalidateQueries({ queryKey: codeRunnerKeys.chapters() });
    },
  });
}
