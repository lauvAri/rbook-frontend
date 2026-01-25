/**
 * ScriptList - 脚本列表组件（分页展示）
 */

import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, Button, Markdown } from '@/components';
import type { CodeScript } from '../types';

// 用于详情页跳转的search参数类型
interface ScriptDetailSearch {
  fromPage: number;
  fromChapter?: string;
}
import styles from './ScriptList.module.css';

interface ScriptListProps {
  scripts: CodeScript[];
  loading?: boolean;
  pageSize?: number;
  initialPage?: number;
  currentChapter?: string;
}

export function ScriptList({
  scripts,
  loading = false,
  pageSize = 5,
  initialPage = 1,
  currentChapter,
}: ScriptListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const navigate = useNavigate();

  const totalPages = Math.ceil(scripts.length / pageSize);

  // 当 initialPage 变化时同步
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // 当章节变化时，重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [currentChapter]);

  // 确保页码在有效范围内
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  
  const paginatedScripts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return scripts.slice(start, start + pageSize);
  }, [scripts, currentPage, pageSize]);

  const handlePrevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    navigate({ to: '/', search: { page: newPage, chapter: currentChapter || undefined } });
  };

  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
    navigate({ to: '/', search: { page: newPage, chapter: currentChapter || undefined } });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>加载中...</p>
      </div>
    );
  }

  const isEmpty = scripts.length === 0;

  return (
    <div className={styles.container}>
      {isEmpty ? (
        <div className={styles.empty}>
          <p>{currentChapter ? `"${currentChapter}" 章节暂无脚本` : '暂无可用脚本'}</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {paginatedScripts.map((script) => (
              <Link
                key={script.id}
                to="/scripts/$scriptId"
                params={{ scriptId: script.id }}
                search={{ fromPage: currentPage, ...(currentChapter ? { fromChapter: currentChapter } : {}) } as ScriptDetailSearch}
                className={styles.cardLink}
              >
                <Card variant="default" padding="md" className={styles.card}>
                  <CardContent>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.scriptName}>{script.name}</h3>
                      <div className={styles.badges}>
                        {script.chapter && (
                          <span className={styles.chapterBadge}>{script.chapter}</span>
                        )}
                        {script.supportsVariables && (
                          <span className={styles.badge}>支持变量</span>
                        )}
                        {script.supportsFileInput && (
                          <span className={styles.badge}>支持文件输入</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.description}>
                      <Markdown content={truncateText(script.description, 150)} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <span className={styles.pageInfo}>
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
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
