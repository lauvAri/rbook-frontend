import { useRef, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useThemeStore } from '@/stores/theme';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string | number;
  fullScreen?: boolean;
}

export function CodeEditor({ value, onChange, language = 'r', height = 400, fullScreen = false }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const theme = useThemeStore((s) => s.theme);

  const handleEditorChange = useCallback((val: string | undefined) => {
    onChange(val ?? '');
  }, [onChange]);

  return (
    <div className={fullScreen ? styles.fullScreenWrapper : ''}>
      <MonacoEditor
        value={value}
        onChange={handleEditorChange}
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        height={height}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
