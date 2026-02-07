/**
 * CodeRunner - 代码执行器主组件
 */

import { useState, useCallback } from 'react';
import { Card, CardContent, Button } from '@/components';
import { useScripts, useExecuteCode } from '../hooks';
import type { CodeScript, RunOptions, ExecuteCodeResponse } from '../types';
import { ScriptSelector } from './ScriptSelector';
import { ModeSelector } from './ModeSelector';
import { VariablesForm } from './VariablesForm';
import { FileInput } from './FileInput';
import { ExecutionResult } from './ExecutionResult';
import styles from './CodeRunner.module.css';

export function CodeRunner() {
  const { data: scripts, isLoading: scriptsLoading } = useScripts();
  const { mutate: execute, isPending: isExecuting } = useExecuteCode();

  const [selectedScript, setSelectedScript] = useState<CodeScript | null>(null);
  const [runOptions, setRunOptions] = useState<RunOptions>({ useVariables: false, useFileInput: false });
  const [variables, setVariables] = useState<Record<string, string | number | boolean>>({});
  const [fileData, setFileData] = useState<{ data: string; isRawInput: boolean } | null>(null);
  const [result, setResult] = useState<ExecuteCodeResponse | null>(null);

  const handleScriptSelect = useCallback((script: CodeScript) => {
    setSelectedScript(script);
    setRunOptions({ useVariables: false, useFileInput: false });
    setFileData(null);
    setResult(null);

    // 初始化变量默认值
    if (script.variables) {
      const defaultValues: Record<string, string | number | boolean> = {};
      script.variables.forEach((v) => {
        defaultValues[v.name] = v.defaultValue;
      });
      setVariables(defaultValues);
    } else {
      setVariables({});
    }
  }, []);

  const handleOptionsChange = useCallback((options: RunOptions) => {
    setRunOptions(options);
    setResult(null);
  }, []);

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
    if (!selectedScript) return;

    // 确保变量类型正确
    let typedVariables: Record<string, string | number | boolean> | undefined;
    if (runOptions.useVariables && selectedScript.variables) {
      typedVariables = {};
      for (const v of selectedScript.variables) {
        const value = variables[v.name];
        if (v.type === 'NUMBER') {
          typedVariables[v.name] = typeof value === 'number' ? value : parseFloat(String(value)) || v.defaultValue;
        } else if (v.type === 'BOOLEAN') {
          typedVariables[v.name] = typeof value === 'boolean' ? value : value === 'true';
        } else {
          typedVariables[v.name] = String(value ?? v.defaultValue);
        }
      }
    }

    execute(
      {
        scriptId: selectedScript.id,
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
            error: '执行请求失败，请稍后重试',
          });
        },
      }
    );
  }, [selectedScript, runOptions, variables, fileData, execute]);

  // 检查是否可以执行
  const canExecute =
    selectedScript &&
    (!runOptions.useFileInput || fileData?.data);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>R 语言代码执行器</h1>
        <p className={styles.subtitle}>选择分析脚本，配置参数，获取执行结果</p>
      </header>
      
      <div className={styles.content}>
        <div className={styles.sections}>
          {/* 步骤 1: 选择脚本 */}
          <Card variant="default" padding="md">
            <CardContent>
              <ScriptSelector
                scripts={scripts || []}
                selectedScript={selectedScript}
                onSelect={handleScriptSelect}
                loading={scriptsLoading}
              />
            </CardContent>
          </Card>

          {/* 步骤 2: 运行选项 */}
          {selectedScript && (
            <Card variant="default" padding="md">
              <CardContent>
                <ModeSelector
                  script={selectedScript}
                  options={runOptions}
                  onChange={handleOptionsChange}
                />
              </CardContent>
            </Card>
          )}

          {/* 步骤 3: 变量配置（可选） */}
          {selectedScript && runOptions.useVariables && selectedScript.variables && (
            <Card variant="default" padding="md">
              <CardContent>
                <VariablesForm
                  variables={selectedScript.variables}
                  values={variables}
                  onChange={handleVariableChange}
                />
              </CardContent>
            </Card>
          )}

          {/* 步骤 4: 文件输入（可选） */}
          {selectedScript && runOptions.useFileInput && (
            <Card variant="default" padding="md">
              <CardContent>
                <FileInput
                  description={selectedScript.fileInputDescription}
                  exampleData={selectedScript.exampleData}
                  onDataChange={handleFileDataChange}
                />
              </CardContent>
            </Card>
          )}

          {/* 执行按钮 */}
          {selectedScript && (
            <section className={styles.section}>
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
          )}

          {/* 执行结果 */}
          {result && (
            <Card variant="elevated" padding="md">
              <CardContent>
                <ExecutionResult result={result} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
