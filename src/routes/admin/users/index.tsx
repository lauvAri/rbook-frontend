/**
 * 用户管理页面
 */

import { useState, useCallback, useEffect } from 'react';
import { MdGroup, MdFileUpload, MdAssignment, MdCheck, MdContentCopy } from 'react-icons/md';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, Button, Input, TextArea } from '@/components';
import {
  getUserList,
  deleteUser,
  resetPassword,
  batchImportUsers,
  useIsAdmin,
  useIsAuthenticated,
} from '@/features/user';
import type { User, BatchImportResponse, ResetPasswordResponse } from '@/features/user';
import styles from './users.module.css';

// 批量导入弹窗
function BatchImportModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (result: BatchImportResponse) => void;
}) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: batchImportUsers,
    onSuccess: (result) => {
      onSuccess(result);
    },
    onError: (err: unknown) => {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          '导入失败'
      );
    },
  });

  const handleSubmit = () => {
    setError(null);
    const lines = inputText.trim().split('\n').filter((line) => line.trim());
    if (lines.length === 0) {
      setError('请输入用户信息');
      return;
    }

    const users = lines.map((line) => {
      const parts = line.split(/[,\t\s]+/).filter((p) => p.trim());
      return {
        username: parts[0]?.trim() || '',
        password: parts[1]?.trim() || undefined,
      };
    });

    const invalidUsers = users.filter((u) => !u.username);
    if (invalidUsers.length > 0) {
      setError('存在无效的用户名');
      return;
    }

    mutation.mutate({ users });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>批量导入用户</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.hint}>
            每行一个用户，格式：用户名 密码（支持逗号、空格、Tab 分隔；密码可选，不填则自动生成）
          </p>
          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="user001,password123&#10;user002 abc123&#10;user003"
            rows={8}
            className={styles.importTextarea}
          />
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={mutation.isPending}
          >
            导入
          </Button>
        </div>
      </div>
    </div>
  );
}

// 导入结果弹窗
function ImportResultModal({
  result,
  onClose,
}: {
  result: BatchImportResponse;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  // 复制全部密码到剪贴板
  const handleCopyAll = useCallback(() => {
    const successResults = result.results.filter((item) => item.success && item.password);
    const text = successResults
      .map((item) => `${item.username}\t${item.password}`)
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result.results]);

  // 导出为 Excel (CSV 格式)
  const handleExportExcel = useCallback(() => {
    const successResults = result.results.filter((item) => item.success);
    const csvContent = [
      '用户名,密码,状态',
      ...successResults.map((item) => `${item.username},${item.password || ''},成功`),
      ...result.results
        .filter((item) => !item.success)
        .map((item) => `${item.username},,失败: ${item.message || ''}`),
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `用户导入结果_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [result.results]);

  const successCount = result.results.filter((item) => item.success && item.password).length;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>导入结果</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.resultSummary}>
            <span className={styles.resultTotal}>总计: {result.total}</span>
            <span className={styles.resultSuccess}>成功: {result.successCount}</span>
            <span className={styles.resultFailed}>失败: {result.failedCount}</span>
          </div>
          <div className={styles.resultList}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>状态</th>
                  <th>密码</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {result.results.map((item, index) => (
                  <tr key={index} className={item.success ? '' : styles.failedRow}>
                    <td>{item.username}</td>
                    <td>
                      {item.success ? (
                        <span className={styles.successBadge}>成功</span>
                      ) : (
                        <span className={styles.failedBadge}>失败</span>
                      )}
                    </td>
                    <td>
                      {item.success && item.password ? (
                        <code className={styles.password}>{item.password}</code>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{item.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.modalFooter}>
          {successCount > 0 && (
            <>
              <Button variant="ghost" onClick={handleCopyAll}>
                {copied ? '✓ 已复制' : '复制全部密码'}
              </Button>
              <Button variant="secondary" onClick={handleExportExcel}>
                导出 Excel
              </Button>
            </>
          )}
          <Button variant="primary" onClick={onClose}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}

// 重置密码结果弹窗
function ResetPasswordModal({
  result,
  onClose,
}: {
  result: ResetPasswordResponse;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result.newPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result.newPassword]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>密码重置成功</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.resetResult}>
            <p>
              用户 <strong>{result.username}</strong> 的密码已重置
            </p>
            <div className={styles.newPassword}>
              <span className={styles.label}>新密码：</span>
              <code className={styles.passwordDisplay}>{result.newPassword}</code>
              <button 
                className={styles.copyBtn} 
                onClick={handleCopy}
                title="复制密码"
              >
                {copied ? <MdCheck /> : <MdContentCopy />}
              </button>
            </div>
            <p className={styles.warning}>请妥善保管此密码，关闭后将无法再次查看</p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <Button variant="primary" onClick={onClose}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}

export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = useIsAdmin();
  const isAuthenticated = useIsAuthenticated();
  const canManageUsers = isAuthenticated && isAdmin;

  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<BatchImportResponse | null>(null);
  const [resetResult, setResetResult] = useState<ResetPasswordResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取用户列表
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUserList,
    enabled: canManageUsers,
  });

  // 删除用户
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // 重置密码
  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (result) => {
      setResetResult(result);
    },
  });

  const handleDelete = useCallback(
    (user: User) => {
      if (window.confirm(`确定要删除用户 ${user.username} 吗？`)) {
        deleteMutation.mutate(user.id);
      }
    },
    [deleteMutation]
  );

  const handleResetPassword = useCallback(
    (user: User) => {
      if (window.confirm(`确定要重置用户 ${user.username} 的密码吗？`)) {
        resetMutation.mutate(user.id);
      }
    },
    [resetMutation]
  );

  const handleImportSuccess = useCallback(
    (result: BatchImportResponse) => {
      setShowImportModal(false);
      setImportResult(result);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    [queryClient]
  );

  // 过滤用户
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 统计数据
  const adminCount = users.filter((u) => u.userType === 'ADMIN').length;
  const workerCount = users.filter((u) => u.userType === 'WORKER').length;

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
              <p>您没有权限访问用户管理页面</p>
              <Button onClick={() => navigate({ to: '/', search: { page: 1, chapter: undefined } })}>返回首页</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 左侧工具栏 */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>功能导航</h3>
          <nav className={styles.sidebarNav}>
            <button className={`${styles.sidebarLink} ${styles.active}`}>
              <span className={styles.sidebarIcon}><MdGroup /></span>
              用户列表
            </button>
            <button
              className={styles.sidebarLink}
              onClick={() => setShowImportModal(true)}
            >
              <span className={styles.sidebarIcon}><MdFileUpload /></span>
              批量导入
            </button>
            <button
              className={styles.sidebarLink}
              onClick={() => navigate({ to: '/admin/users/logs' })}
            >
              <span className={styles.sidebarIcon}><MdAssignment /></span>
              操作日志
            </button>
          </nav>
        </div>

        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>用户统计</h3>
          <div className={styles.sidebarStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>总用户数</span>
              <span className={`${styles.statValue} ${styles.primary}`}>{users.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>管理员</span>
              <span className={`${styles.statValue} ${styles.accent}`}>{adminCount}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>操作员</span>
              <span className={styles.statValue}>{workerCount}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>用户管理</h1>
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => setShowImportModal(true)}>
              + 批量导入
            </Button>
          </div>
        </div>

        <Card>
          <CardContent>
            <div className={styles.toolbar}>
              <Input
                placeholder="搜索用户名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <span className={styles.count}>共 {filteredUsers.length} 个用户</span>
            </div>

            {isLoading ? (
              <div className={styles.loading}>加载中...</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>用户名</th>
                      <th>类型</th>
                      <th>创建时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>
                          <span
                            className={
                              user.userType === 'ADMIN'
                                ? styles.adminBadge
                                : styles.workerBadge
                            }
                          >
                            {user.userType === 'ADMIN' ? '管理员' : '操作员'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                              loading={resetMutation.isPending}
                            >
                              重置密码
                            </Button>
                            {user.userType !== 'ADMIN' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(user)}
                                loading={deleteMutation.isPending}
                                className={styles.deleteBtn}
                              >
                                删除
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* 批量导入弹窗 */}
      {showImportModal && (
        <BatchImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}

      {/* 导入结果弹窗 */}
      {importResult && (
        <ImportResultModal
          result={importResult}
          onClose={() => setImportResult(null)}
        />
      )}

      {/* 重置密码结果弹窗 */}
      {resetResult && (
        <ResetPasswordModal result={resetResult} onClose={() => setResetResult(null)} />
      )}
    </div>
  );
}
