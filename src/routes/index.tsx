/**
 * 首页路由 - 脚本列表
 */

import { useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useChapters, useScripts } from '@/features/code-runner/hooks';
import { ScriptList, ChapterNavigation } from '@/features/code-runner/components';
import styles from './index.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { data: scripts, isLoading } = useScripts();
  const { data: chaptersData } = useChapters();
  const { page, chapter } = useSearch({ from: '/' });

  const chapters = useMemo(() => {
    if (!chaptersData) return [];
    return [...chaptersData].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.name.localeCompare(b.name, 'zh-Hans-CN');
    });
  }, [chaptersData]);

  // 根据章节过滤脚本
  const filteredScripts = useMemo(() => {
    if (!scripts) return [];
    if (!chapter) return scripts;
    return scripts.filter((s) => s.chapter === chapter);
  }, [scripts, chapter]);

  // 切换章节
  const handleChapterChange = (selectedChapter: string | undefined) => {
    navigate({ to: '/', search: { page: 1, chapter: selectedChapter } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>R 语言代码执行器</h1>
        <p className={styles.subtitle}>选择一个分析脚本，配置参数，获取执行结果</p>
      </header>

      <div className={styles.mainContent}>
        <ChapterNavigation
          chapters={chapters}
          currentChapter={chapter}
          totalCount={scripts?.length || 0}
          onChapterChange={handleChapterChange}
        />

        {/* 右侧脚本列表 */}
        <div className={styles.listWrapper}>
          <ScriptList
            scripts={filteredScripts}
            loading={isLoading}
            pageSize={5}
            initialPage={page}
            currentChapter={chapter}
          />
        </div>
      </div>
    </div>
  );
}
