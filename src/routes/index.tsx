/**
 * 首页路由 - 脚本列表
 */

import { useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useChapters, useScripts } from '@/features/code-runner/hooks';
import { ScriptList, ChapterNavigation } from '@/features/code-runner/components';
import { SearchBox } from '@/components/SearchBox';
import { useScriptSearch } from '@/hooks/useScriptSearch';
import styles from './index.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { data: scripts, isLoading } = useScripts();
  const { data: chaptersData, isLoading: chaptersLoading } = useChapters();
  const { page, chapter, search: urlSearch } = useSearch({ from: '/' });

  // 搜索状态管理
  const { searchInput, setSearchInput, handleSearch, handleClearSearch } = useScriptSearch({
    initialSearch: urlSearch,
    chapter,
  });

  const chapters = useMemo(() => {
    if (!chaptersData) return [];
    return [...chaptersData].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.name.localeCompare(b.name, 'zh-Hans-CN');
    });
  }, [chaptersData]);

  // 根据章节和搜索关键词过滤脚本
  const filteredScripts = useMemo(() => {
    if (!scripts) return [];
    let result = scripts;

    // 章节过滤
    if (chapter) {
      result = result.filter((s) => s.chapter === chapter);
    }

    // 搜索过滤（模糊匹配脚本名称）
    if (urlSearch && urlSearch.trim()) {
      const keyword = urlSearch.trim().toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [scripts, chapter, urlSearch]);

  // 切换章节
  const handleChapterChange = (selectedChapter: string | undefined) => {
    navigate({ to: '/', search: { page: 1, chapter: selectedChapter, search: urlSearch } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>《医学统计学》</h1>
        <p className={styles.subtitle}>免费在线计算，无需安装软件！</p>
      </header>

      <div className={styles.mainContent}>
        <ChapterNavigation
          chapters={chapters}
          currentChapter={chapter}
          totalCount={scripts?.length || 0}
          onChapterChange={handleChapterChange}
          loading={chaptersLoading}
        />

        {/* 右侧脚本列表 */}
        <div className={styles.listWrapper}>
          {/* 搜索框 */}
          <SearchBox
            value={searchInput}
            placeholder="搜索脚本名称..."
            onChange={setSearchInput}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />

          {/* 搜索结果提示 */}
          {urlSearch && (
            <div className={styles.searchInfo}>
              搜索 "{urlSearch}" 的结果：共 {filteredScripts.length} 条
              {chapter && ` (限定在「${chapter}」)`}
            </div>
          )}

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
