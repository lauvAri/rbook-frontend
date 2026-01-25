/**
 * 首页路由 - 脚本列表
 */

import { useState, useMemo } from 'react';
import { MdMenuBook, MdMenuOpen, MdMenu } from 'react-icons/md';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useScripts } from '@/features/code-runner/hooks';
import { ScriptList } from '@/features/code-runner/components';
import styles from './index.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { data: scripts, isLoading } = useScripts();
  const { page, chapter } = useSearch({ from: '/' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 提取所有不重复的章节
  const chapters = useMemo(() => {
    if (!scripts) return [];
    const chapterSet = new Set<string>();
    scripts.forEach((s) => {
      if (s.chapter) chapterSet.add(s.chapter);
    });
    // 支持“第N章”N为阿拉伯数字或常见中文数字，按自然顺序排序
    // 支持到四十章的中文数字
    const zhNumMap: Record<string, number> = {
      '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
      '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15, '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20,
      '二十一': 21, '二十二': 22, '二十三': 23, '二十四': 24, '二十五': 25, '二十六': 26, '二十七': 27, '二十八': 28, '二十九': 29, '三十': 30,
      '三十一': 31, '三十二': 32, '三十三': 33, '三十四': 34, '三十五': 35, '三十六': 36, '三十七': 37, '三十八': 38, '三十九': 39, '四十': 40
    };
    function getChapterNum(str: string): number | null {
      const reg = /^第(\d+)章/;
      // 匹配“第xxx章”，xxx为一到三十、四十的中文
      const regZh = /^第([一二三四五六七八九十]{1,4})章/;
      const m = str.match(reg);
      if (m) return parseInt(m[1], 10);
      const mz = str.match(regZh);
      if (mz && zhNumMap[mz[1]]) return zhNumMap[mz[1]];
      return null;
    }
    return Array.from(chapterSet).sort((a, b) => {
      const na = getChapterNum(a);
      const nb = getChapterNum(b);
      if (na !== null && nb !== null) return na - nb;
      if (na !== null) return -1;
      if (nb !== null) return 1;
      return a.localeCompare(b, 'zh-Hans-CN');
    });
  }, [scripts]);

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
                const count = scripts?.filter((s) => s.chapter === ch).length || 0;
                return (
                  <button
                    key={ch}
                    className={`${styles.chapterItem} ${chapter === ch ? styles.chapterItemActive : ''}`}
                    onClick={() => handleChapterChange(ch)}
                  >
                    <span className={styles.chapterIcon}><MdMenuBook /></span>
                    <span className={styles.chapterName}>{ch}</span>
                    <span className={styles.chapterCount}>{count}</span>
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
