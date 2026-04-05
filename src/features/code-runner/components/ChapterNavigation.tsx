/**
 * 章节导航组件（支持移动端侧边栏）
 */

import { useState } from 'react';
import { MdMenuBook, MdMenuOpen } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import styles from './ChapterNavigation.module.css';

export interface ChapterNavItem {
  name: string;
  scriptCount: number;
}

interface ChapterNavigationProps {
  chapters: ChapterNavItem[];
  currentChapter?: string;
  totalCount: number;
  onChapterChange: (chapter?: string) => void;
  loading?: boolean;
}

export function ChapterNavigation({
  chapters,
  currentChapter,
  totalCount,
  onChapterChange,
  loading = false,
}: ChapterNavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <>
        <div className={styles.mobileChapterBtn}>
          <Skeleton height={36} />
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Skeleton width={80} height={20} />
          </div>
          <nav className={styles.chapterNav}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={40} style={{ marginBottom: 4, borderRadius: 6 }} />
            ))}
          </nav>
        </aside>
      </>
    );
  }

  if (chapters.length === 0) {
    return null;
  }

  const handleSelect = (selectedChapter?: string) => {
    onChapterChange(selectedChapter);
    setSidebarOpen(false);
  };

  return (
    <>
      <button
        className={styles.mobileChapterBtn}
        onClick={() => setSidebarOpen(true)}
      >
        <MdMenuBook style={{ verticalAlign: 'middle', marginRight: 4 }} /> {currentChapter || '全部章节'}
      </button>

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            className={`${styles.chapterItem} ${!currentChapter ? styles.chapterItemActive : ''}`}
            onClick={() => handleSelect(undefined)}
          >
            <span className={styles.chapterIcon}><MdMenuOpen /></span>
            <span className={styles.chapterName}>全部章节</span>
            <span className={styles.chapterCount}>{totalCount}</span>
          </button>
          {chapters.map((ch) => (
            <button
              key={ch.name}
              className={`${styles.chapterItem} ${currentChapter === ch.name ? styles.chapterItemActive : ''}`}
              onClick={() => handleSelect(ch.name)}
            >
              <span className={styles.chapterIcon}><MdMenuBook /></span>
              <span className={styles.chapterName}>{ch.name}</span>
              <span className={styles.chapterCount}>{ch.scriptCount}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
