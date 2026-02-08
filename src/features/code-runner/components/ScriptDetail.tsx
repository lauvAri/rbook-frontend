/**
 * ScriptDetail - 脚本详情组件
 * 包含脚本信息展示和代码运行功能
 */

import { useState, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, Button, Markdown } from '@/components';
import { useExecuteCode } from '../hooks';
import type { CodeScript, RunOptions, ExecuteCodeResponse } from '../types';

// 用于接收详情页search参数类型

import { ModeSelector } from './ModeSelector';
import { VariablesForm } from './VariablesForm';
import { FileInput } from './FileInput';
import { ExecutionResult } from './ExecutionResult';
import rLogo from '../assets/r.png';
import styles from './ScriptDetail.module.css';

interface ScriptDetailProps {
  script: CodeScript;
    fromPage?: number;
    fromChapter?: string;
}

export function ScriptDetail({ script, fromPage, fromChapter }: ScriptDetailProps) {
  const { mutate: execute, isPending: isExecuting } = useExecuteCode();

  const [runOptions, setRunOptions] = useState<RunOptions>({
    useVariables: false,
    useFileInput: false,
  });
  const [variables, setVariables] = useState<Record<string, string | number | boolean>>(() => {
    const defaultValues: Record<string, string | number | boolean> = {};
    if (script.variables) {
      script.variables.forEach((v) => {
        // 根据类型转换默认值
        if (v.type === 'BOOLEAN') {
          // 统一处理布尔类型：兼容 TRUE/true/True 等格式
          defaultValues[v.name] = String(v.defaultValue).toLowerCase() === 'true';
        } else if (v.type === 'NUMBER') {
          defaultValues[v.name] = typeof v.defaultValue === 'number'
            ? v.defaultValue
            : parseFloat(String(v.defaultValue));
        } else {
          defaultValues[v.name] = v.defaultValue;
        }
      });
    }
    return defaultValues;
  });
  const [fileData, setFileData] = useState<{ data: string; isRawInput: boolean } | null>(null);
  const [result, setResult] = useState<ExecuteCodeResponse | null>(null);
  const [codeExpanded, setCodeExpanded] = useState(false);

  const handleOptionsChange = useCallback((options: RunOptions) => {
    setRunOptions(options);
    setResult(null);

    // 当关闭自定义参数时，重置变量为默认值
    if (!options.useVariables && script.variables) {
      const defaultValues: Record<string, string | number | boolean> = {};
      script.variables.forEach((v) => {
        // 根据类型转换默认值
        if (v.type === 'BOOLEAN') {
          defaultValues[v.name] = String(v.defaultValue).toLowerCase() === 'true';
        } else if (v.type === 'NUMBER') {
          defaultValues[v.name] = typeof v.defaultValue === 'number'
            ? v.defaultValue
            : parseFloat(String(v.defaultValue));
        } else {
          defaultValues[v.name] = v.defaultValue;
        }
      });
      setVariables(defaultValues);
    }
  }, [script.variables]);

  const handleVariableChange = useCallback(
    (name: string, value: string | number | boolean) => {
      setVariables((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileDataChange = useCallback((data: string, isRawInput: boolean) => {
    setFileData({ data, isRawInput });
  }, []);

  const handleExecute = useCallback(() => {
    // 确保变量类型正确
    let typedVariables: Record<string, string | number | boolean> | undefined;
    if (runOptions.useVariables && script.variables) {
      typedVariables = {};
      for (const v of script.variables) {
        const value = variables[v.name];
        if (v.type === 'NUMBER') {
          typedVariables[v.name] =
            typeof value === 'number' ? value : parseFloat(String(value)) || v.defaultValue;
        } else if (v.type === 'BOOLEAN') {
          typedVariables[v.name] = typeof value === 'boolean' ? value : value === 'true';
        } else {
          typedVariables[v.name] = String(value ?? v.defaultValue);
        }
      }
    }

    execute(
      {
        scriptId: script.id,
        variables: typedVariables,
        fileData: runOptions.useFileInput ? fileData?.data : undefined,
        isRawInput: runOptions.useFileInput ? fileData?.isRawInput : undefined,
      },
      {
        onSuccess: (response) => {
          setResult(response);
        },
        onError: () => {
          setResult({
            success: false,
            outputs: [],
            error: '执行请求失败，请稀后重试',
          });
        },
      }
    );
  }, [script, runOptions, variables, fileData, execute]);

  const canExecute = !runOptions.useFileInput || fileData?.data;

  return (
    <div className={styles.container}>
      {/* 返回按钮 */}
      <div className={styles.backNav}>
        <Link to="/" search={{ page: fromPage ?? 1, chapter: fromChapter, search: undefined }} className={styles.backLink}>
          ← 返回列表
        </Link>
      </div>

      {/* 脚本信息 */}
      <Card variant="default" padding="md" className={styles.infoCard}>
        <CardContent>
          <h1 className={styles.title}>{script.name}</h1>
          <div className={styles.badges}>
            {script.supportsVariables && <span className={styles.badge}>支持变量</span>}
            {script.supportsFileInput && <span className={styles.badge}>支持文件输入</span>}
          </div>
          <div className={styles.description}>
            <Markdown content={script.description} />
          </div>
        </CardContent>
      </Card>

      {/* R 代码展示 */}
      {script.scriptContent && (
        <Card variant="default" padding="md">
          <CardContent>
            <div
              className={styles.codeHeader}
              onClick={() => setCodeExpanded((prev) => !prev)}
            >
              <div className={styles.codeTitleWrapper}>
                <img src={rLogo} alt="R" className={styles.rLogo} />
                <h2 className={styles.sectionTitle}>R 脚本代码</h2>
              </div>
              <span className={styles.expandIcon}>{codeExpanded ? '▼' : '▶'}</span>
            </div>
            {codeExpanded && (
              <pre className={styles.codeBlock}>
                <code>{script.scriptContent}</code>
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      {/* 运行选项 */}
      <Card variant="default" padding="md">
        <CardContent>
          <ModeSelector script={script} options={runOptions} onChange={handleOptionsChange} />
        </CardContent>
      </Card>

      {/* 变量配置 */}
      {runOptions.useVariables && script.variables && (
        <Card variant="default" padding="md">
          <CardContent>
            <VariablesForm
              variables={script.variables}
              values={variables}
              onChange={handleVariableChange}
            />
          </CardContent>
        </Card>
      )}

      {/* 文件输入 */}
      {runOptions.useFileInput && (
        <Card variant="default" padding="md">
          <CardContent>
            <FileInput
              description={script.fileInputDescription}
              exampleData={script.exampleData}
              onDataChange={handleFileDataChange}
            />
          </CardContent>
        </Card>
      )}

      {/* 执行按钮 */}
      <section className={styles.executeSection}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isExecuting}
          disabled={!canExecute}
          onClick={handleExecute}
        >
          {isExecuting ? '执行中...' : '执行代码'}
        </Button>
      </section>

      {/* 执行结果 */}
      {result && (
        <Card variant="elevated" padding="md">
          <CardContent>
            <ExecutionResult result={result} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
