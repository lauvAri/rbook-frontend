/**
 * 首页路由 - 脚本列表
 */

import { useState, useMemo } from 'react';
import { MdMenuBook, MdMenuOpen } from 'react-icons/md';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useChapters, useScripts } from '@/features/code-runner/hooks';
import { ScriptList } from '@/features/code-runner/components';
import styles from './index.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { data: scripts, isLoading } = useScripts();
  const { data: chaptersData } = useChapters();
  const { page, chapter } = useSearch({ from: '/' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setSidebarOpen(false); // 移动端选择后关闭侧边栏
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>R 语言代码执行器</h1>
        <p className={styles.subtitle}>选择一个分析脚本，配置参数，获取执行结果</p>
      </header>

      <div className={styles.mainContent}>
        {/* 移动端章节按钮 */}
        {chapters.length > 0 && (
          <button
            className={styles.mobileChapterBtn}
            onClick={() => setSidebarOpen(true)}
          >
            <MdMenuBook style={{ verticalAlign: 'middle', marginRight: 4 }} /> {chapter || '全部章节'}
          </button>
        )}

        {/* 遮罩层 */}
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 左侧章节导航 */}
        {chapters.length > 0 && (
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}><MdMenuBook style={{ verticalAlign: 'middle', marginRight: 4 }} />章节目录</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </button>
            </div>
            <nav className={styles.chapterNav}>
              <button
                className={`${styles.chapterItem} ${!chapter ? styles.chapterItemActive : ''}`}
                onClick={() => handleChapterChange(undefined)}
              >
                <span className={styles.chapterIcon}><MdMenuOpen /></span>
                <span className={styles.chapterName}>全部章节</span>
                <span className={styles.chapterCount}>{scripts?.length || 0}</span>
              </button>
              {chapters.map((ch) => {
                return (
                  <button
                    key={ch.name}
                    className={`${styles.chapterItem} ${chapter === ch.name ? styles.chapterItemActive : ''}`}
                    onClick={() => handleChapterChange(ch.name)}
                  >
                    <span className={styles.chapterIcon}><MdMenuBook /></span>
                    <span className={styles.chapterName}>{ch.name}</span>
                    <span className={styles.chapterCount}>{ch.scriptCount}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

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
