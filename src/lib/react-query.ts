import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    // 核心配置：数据在 1 分钟内被认为是"新鲜"的，不会重新请求
    staleTime: 1000 * 60, 
    // 失败后自动重试 1 次（而不是默认的 3 次）
    retry: 1,
    // 窗口重新获得焦点时是否刷新数据 (根据需求开启，后台管理系统通常设为 false)
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });