/**
 * 脚本选择器组件
 */

import type { CodeScript } from '../types';
import styles from './ScriptSelector.module.css';

interface ScriptSelectorProps {
  scripts: CodeScript[];
  selectedScript: CodeScript | null;
  onSelect: (script: CodeScript) => void;
  loading?: boolean;
}

export function ScriptSelector({
  scripts,
  selectedScript,
  onSelect,
  loading = false,
}: ScriptSelectorProps) {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>加载脚本列表...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>选择分析脚本</label>
      <div className={styles.list}>
        {scripts.map((script) => (
          <button
            key={script.id}
            className={`${styles.item} ${selectedScript?.id === script.id ? styles.selected : ''}`}
            onClick={() => onSelect(script)}
          >
            <span className={styles.name}>{script.name}</span>
            <span className={styles.description}>{script.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
