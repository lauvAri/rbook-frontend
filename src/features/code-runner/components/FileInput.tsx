/**
 * 文件输入组件
 */

import { useState } from 'react';
import { FileUpload, TextArea } from '@/components';
import styles from './FileInput.module.css';

type InputType = 'file' | 'text';

interface FileInputProps {
  description?: string;
  exampleData?: string;
  onDataChange: (data: string, isRawInput: boolean) => void;
}

export function FileInput({ description, exampleData, onDataChange }: FileInputProps) {
  const [inputType, setInputType] = useState<InputType>('file');
  const [textData, setTextData] = useState('');

  const handleUseExample = () => {
    if (exampleData) {
      setTextData(exampleData);
      setInputType('text');
      onDataChange(exampleData, true);
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onDataChange(content, false);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (value: string) => {
    setTextData(value);
    onDataChange(value, true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>数据输入</label>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${inputType === 'file' ? styles.active : ''}`}
            onClick={() => setInputType('file')}
          >
            上传文件
          </button>
          <button
            className={`${styles.tab} ${inputType === 'text' ? styles.active : ''}`}
            onClick={() => setInputType('text')}
          >
            输入数据
          </button>
        </div>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {exampleData && (
        <div className={styles.exampleSection}>
          <div className={styles.exampleHeader}>
            <span className={styles.exampleTitle}>📋 期望的数据格式</span>
            <button className={styles.useExampleBtn} onClick={handleUseExample}>
              使用示例数据
            </button>
          </div>
          <pre className={styles.exampleData}>{exampleData}</pre>
        </div>
      )}

      {inputType === 'file' ? (
        <FileUpload
          accept=".csv"
          onFileSelect={handleFileSelect}
          helperText="支持 CSV 格式文件"
        />
      ) : (
        <TextArea
          value={textData}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="请输入 CSV 格式数据，例如：
name,age,score
张三,25,89
李四,28,92
王五,22,85"
          rows={8}
          helperText="请按 CSV 格式输入数据，第一行为列名"
        />
      )}
    </div>
  );
}
