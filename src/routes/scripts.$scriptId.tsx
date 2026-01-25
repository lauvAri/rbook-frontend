/**
 * 脚本详情页
 */

import { useParams, useSearch } from '@tanstack/react-router';
import { useScript } from '@/features/code-runner/hooks';
import { ScriptDetail } from '@/features/code-runner/components';
import styles from './scripts.$scriptId.module.css';

export function ScriptDetailPage() {
  const { scriptId } = useParams({ from: '/scripts/$scriptId' });
  // 读取fromChapter参数，传递给ScriptDetail
  const search = useSearch({ from: '/scripts/$scriptId' });
  const { data: script, isLoading, error } = useScript(scriptId);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>加载失败</h2>
          <p>{error?.message || '脚本不存在'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ScriptDetail script={script} {...search} />
    </div>
  );
}
