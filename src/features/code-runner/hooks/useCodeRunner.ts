/**
 * 代码执行器 - React Query Hooks
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { codeRunnerApi } from '../api';
import type { ExecuteCodeRequest } from '../types';

/** 查询键 */
export const codeRunnerKeys = {
  all: ['code-runner'] as const,
  scripts: () => [...codeRunnerKeys.all, 'scripts'] as const,
  script: (id: string) => [...codeRunnerKeys.all, 'script', id] as const,
};

/** 获取所有脚本列表 */
export function useScripts() {
  return useQuery({
    queryKey: codeRunnerKeys.scripts(),
    queryFn: () => codeRunnerApi.getScripts(),
  });
}

/** 获取单个脚本详情 */
export function useScript(scriptId: string) {
  return useQuery({
    queryKey: codeRunnerKeys.script(scriptId),
    queryFn: () => codeRunnerApi.getScript(scriptId),
    enabled: !!scriptId,
  });
}

/** 执行代码 */
export function useExecuteCode() {
  return useMutation({
    mutationFn: (request: ExecuteCodeRequest) => codeRunnerApi.execute(request),
  });
}
