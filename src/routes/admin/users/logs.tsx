/**
 * 用户操作日志页面
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Button } from '@/components';
import { MdRefresh } from 'react-icons/md';
import { getAllLogs, getUserList, useIsAdmin, useIsAuthenticated } from '@/features/user';
import { useScripts } from '@/features/code-runner/hooks';
import styles from './logs.module.css';

// 操作类型映射
const operationTypeMap: Record<string, string> = {
  CREATE_SCRIPT: '创建脚本',
  UPDATE_SCRIPT: '更新脚本',
  DELETE_SCRIPT: '删除脚本',
  EXECUTE_SCRIPT: '执行脚本',
  LOGIN: '用户登录',
  LOGOUT: '用户登出',
};

export function UserLogsPage() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const isAuthenticated = useIsAuthenticated();
  const canViewLogs = isAuthenticated && isAdmin;
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // 获取日志 - 每次进入页面都重新请求
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-logs', page, pageSize],
    queryFn: () => getAllLogs(page, pageSize),
    staleTime: 0, // 数据立即过期
    refetchOnMount: 'always', // 每次挂载组件时都重新请求
    enabled: canViewLogs,
  });

  // 获取用户列表用于映射 userId -> username
  const { data: users } = useQuery({
    queryKey: ['users-for-logs'],
    queryFn: () => getUserList(),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    enabled: canViewLogs,
  });

  // 获取脚本列表用于判断脚本是否存在
  const { data: scripts } = useScripts();

  // 构建 userId -> username 映射
  const userMap = useMemo(() => {
    const map = new Map<number, string>();
    users?.forEach((user) => map.set(user.id, user.username));
    return map;
  }, [users]);

  // 构建脚本ID集合，用于快速判断脚本是否存在
  const scriptSet = useMemo(() => {
    const set = new Set<string>();
    scripts?.forEach((script) => set.add(script.id));
    return set;
  }, [scripts]);

  const logs = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, navigate]);

  // 检查权限
  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <Card>
          <CardContent>
            <div className={styles.noPermission}>
              <h2>无权访问</h2>
              <p>您没有权限访问日志页面</p>
              <Button onClick={() => navigate({ to: '/', search: { page: 1, chapter: undefined, search: undefined } })}>返回首页</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate({ to: '/admin/users' })}
          >
            ← 返回用户管理
          </button>
          <h1 className={styles.title}>操作日志</h1>
        </div>
        <div className={styles.headerRight}>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <MdRefresh style={{ verticalAlign: 'middle', marginRight: 4 }} /> 刷新
          </Button>
          <span className={styles.count}>共 {totalElements} 条记录</span>
        </div>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className={styles.loading}>加载中...</div>
          ) : logs.length === 0 ? (
            <div className={styles.empty}>暂无日志记录</div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>用户</th>
                      <th>操作类型</th>
                      <th>操作描述</th>
                      <th>脚本ID</th>
                      <th>时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>
                          <div className={styles.userCell}>
                            <span className={styles.username}>
                              {userMap.get(log.userId) || '未知用户'}
                            </span>
                            <span className={styles.userId}>ID: {log.userId}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.operationType}>
                            {operationTypeMap[log.operationType] || log.operationType}
                          </span>
                        </td>
                        <td>{log.operationDesc}</td>
                        <td>
                          {log.scriptId ? (
                            log.operationType === 'DELETE_SCRIPT' ? (
                              <span className={styles.deletedScript} title="该脚本已被删除">
                                <code className={styles.scriptId}>{log.scriptId}</code>
                                <span className={styles.deletedBadge}>已删除</span>
                              </span>
                            ) : scriptSet.has(log.scriptId) ? (
                              <Link
                                to="/scripts/$scriptId"
                                params={{ scriptId: log.scriptId }}
                                search={{ fromPage: 1 }}
                                className={styles.scriptLink}
                              >
                                <code className={styles.scriptId}>{log.scriptId}</code>
                              </Link>
                            ) : (
                              <span className={styles.deletedScript} title="该脚本不存在或已被删除">
                                <code className={styles.scriptId}>{log.scriptId}</code>
                                <span className={styles.notFoundBadge}>不存在</span>
                              </span>
                            )
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    上一页
                  </Button>
                  <span className={styles.pageInfo}>
                    第 {page + 1} / {totalPages} 页
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
