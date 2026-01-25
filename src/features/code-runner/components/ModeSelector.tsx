/**
 * 运行选项选择器组件
 * 支持变量替换和文件输入的组合选择
 */

import type { CodeScript, RunOptions } from '../types';
import runnerIcon from '../assets/runner.png';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  script: CodeScript;
  options: RunOptions;
  onChange: (options: RunOptions) => void;
}

export function ModeSelector({ script, options, onChange }: ModeSelectorProps) {
  const hasOptions = script.supportsVariables || script.supportsFileInput;

  if (!hasOptions) {
    return (
      <div className={styles.container}>
        <div className={styles.directOnly}>
          <span className={styles.directIcon}>▶</span>
          <span>此脚本将直接运行，无需额外配置</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.labelWrapper}>
        <img src={runnerIcon} alt="" className={styles.labelIcon} />
        <label className={styles.label}>运行选项</label>
      </div>
      <p className={styles.hint}>可同时启用多个选项</p>
      <div className={styles.options}>
        {script.supportsVariables && script.variables && (
          <label className={`${styles.option} ${options.useVariables ? styles.selected : ''}`}>
            <input
              type="checkbox"
              checked={options.useVariables}
              onChange={(e) => onChange({ ...options, useVariables: e.target.checked })}
              className={styles.checkbox}
            />
            <div className={styles.optionContent}>
              <span className={styles.title}>自定义参数</span>
              <span className={styles.description}>修改脚本参数后运行</span>
            </div>
          </label>
        )}
        {script.supportsFileInput && (
          <label className={`${styles.option} ${options.useFileInput ? styles.selected : ''}`}>
            <input
              type="checkbox"
              checked={options.useFileInput}
              onChange={(e) => onChange({ ...options, useFileInput: e.target.checked })}
              className={styles.checkbox}
            />
            <div className={styles.optionContent}>
              <span className={styles.title}>上传数据</span>
              <span className={styles.description}>上传 CSV 文件或输入数据</span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
