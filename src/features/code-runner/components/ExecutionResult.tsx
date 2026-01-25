/**
 * 执行结果展示组件
 */

import type { ExecuteCodeResponse, OutputItem } from '../types';
import styles from './ExecutionResult.module.css';

interface ExecutionResultProps {
  result: ExecuteCodeResponse;
}

function TextOutput({ content }: { content: string }) {
  return (
    <div className={styles.textOutput}>
      <pre className={styles.pre}>{content}</pre>
    </div>
  );
}

function ImageOutput({
  data,
  format,
  caption,
}: {
  data: string;
  format: string;
  caption?: string;
}) {
  const src =
    format === 'svg'
      ? `data:image/svg+xml;base64,${data}`
      : `data:image/${format};base64,${data}`;

  return (
    <div className={styles.imageOutput}>
      <img src={src} alt={caption || '执行结果图表'} className={styles.image} />
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}

function OutputItemComponent({ item }: { item: OutputItem }) {
  if (item.type === 'text') {
    return <TextOutput content={item.content} />;
  }
  return <ImageOutput data={item.data} format={item.format} caption={item.caption} />;
}

export function ExecutionResult({ result }: ExecutionResultProps) {
  if (!result.success) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className={styles.errorContent}>
            <h4>执行失败</h4>
            <p>{result.error}</p>
          </div>
        </div>

        {/* 显示执行过程中的输出信息 */}
        {result.outputs && result.outputs.length > 0 && (
          <div className={styles.errorOutputs}>
            <div className={styles.errorOutputsHeader}>
              <span className={styles.errorOutputsTitle}>执行日志</span>
              {result.executionTime && (
                <span className={styles.time}>耗时 {result.executionTime}ms</span>
              )}
            </div>
            <div className={styles.outputs}>
              {result.outputs.map((item, index) => (
                <OutputItemComponent key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>执行结果</span>
        {result.executionTime && (
          <span className={styles.time}>耗时 {result.executionTime}ms</span>
        )}
      </div>
      <div className={styles.outputs}>
        {result.outputs.map((item, index) => (
          <OutputItemComponent key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
