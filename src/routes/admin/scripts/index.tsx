/**
 * 脚本管理列表页
 */

import { useState, useMemo, useEffect } from 'react';
import { Link, useSearch, useNavigate } from '@tanstack/react-router';
import { useAdminScripts, useDeleteScript } from '@/features/code-runner/hooks';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import styles from './index.module.css';

const PAGE_SIZE = 5;

export function AdminScriptsPage() {
  const { page } = useSearch({ from: '/admin/scripts' });
  const navigate = useNavigate();
  const { data: scripts, isLoading, error } = useAdminScripts();
  const deleteScriptMutation = useDeleteScript();
  
  const [currentPage, setCurrentPage] = useState(page);

  // 同步 URL 参数
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const totalPages = scripts ? Math.ceil(scripts.length / PAGE_SIZE) : 0;

  // 确保页码在有效范围内
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
      navigate({ to: '/admin/scripts', search: { page: totalPages } });
    }
  }, [totalPages, currentPage, navigate]);

  const paginatedScripts = useMemo(() => {
    if (!scripts) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return scripts.slice(start, start + PAGE_SIZE);
  }, [scripts, currentPage]);

  const handlePrevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    navigate({ to: '/admin/scripts', search: { page: newPage } });
  };

  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
    navigate({ to: '/admin/scripts', search: { page: newPage } });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定要删除脚本「${name}」吗？此操作不可恢复。`)) {
      deleteScriptMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>加载失败: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>脚本管理</h1>
        <Link to="/admin/scripts/new">
          <Button>+ 新建脚本</Button>
        </Link>
      </div>

      {!scripts || scripts.length === 0 ? (
        <Card>
          <div className={styles.empty}>
            <p>暂无脚本</p>
            <Link to="/admin/scripts/new">
              <Button>创建第一个脚本</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className={styles.list}>
            {paginatedScripts.map((script) => (
              <Card key={script.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.scriptName}>{script.name}</h3>
                  <div className={styles.badges}>
                    {script.supportsVariables && (
                      <span className={styles.badge}>支持变量</span>
                    )}
                    {script.supportsFileInput && (
                      <span className={styles.badge}>支持文件输入</span>
                    )}
                  </div>
                </div>
                <p className={styles.description}>
                  {truncateText(script.description || '暂无描述', 150)}
                </p>
                <div className={styles.scriptId}>ID: {script.id}</div>
                <div className={styles.actions}>
                  <Link to="/admin/scripts/$scriptId/edit" params={{ scriptId: script.id }} search={{ fromPage: currentPage }}>
                    <Button variant="secondary">编辑</Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(script.id, script.name)}
                    disabled={deleteScriptMutation.isPending}
                  >
                    {deleteScriptMutation.isPending ? '删除中...' : '删除'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="secondary"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <span className={styles.pageInfo}>
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** 截断文本，超过指定长度显示省略号 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
