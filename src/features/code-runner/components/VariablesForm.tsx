/**
 * 变量表单组件
 */

import { useState, useEffect, useRef } from 'react';
import { Input, Select, type SelectOption } from '@/components';
import type { ReplacementVariable } from '../types';
import styles from './VariablesForm.module.css';

interface VariablesFormProps {
  variables: ReplacementVariable[];
  values: Record<string, string | number | boolean>;
  onChange: (name: string, value: string | number | boolean) => void;
}

const BOOLEAN_OPTIONS: SelectOption[] = [
  { label: 'True', value: 'true' },
  { label: 'False', value: 'false' },
];

export function VariablesForm({ variables, values, onChange }: VariablesFormProps) {
  // 为数字类型维护本地输入状态（显示用）
  const [numberInputs, setNumberInputs] = useState<Record<string, string>>({});
  // 记录是否正在编辑某个字段
  const editingRef = useRef<Record<string, boolean>>({});

  // 当 values 变化且没有在编辑时，更新显示状态
  useEffect(() => {
    const updatedInputs: Record<string, string> = {};
    variables.forEach((variable) => {
      if (variable.type === 'NUMBER') {
        // 如果正在编辑，不更新
        if (editingRef.current[variable.name]) {
          return;
        }

        const value = values[variable.name];
        if (value !== undefined && value !== null) {
          updatedInputs[variable.name] = String(value);
        }
      }
    });

    if (Object.keys(updatedInputs).length > 0) {
      setNumberInputs((prev) => ({ ...prev, ...updatedInputs }));
    }
  }, [variables, values]);

  const handleNumberInputChange = (variable: ReplacementVariable, inputValue: string) => {
    // 标记为正在编辑
    editingRef.current[variable.name] = true;

    // 更新本地显示状态
    setNumberInputs((prev) => ({
      ...prev,
      [variable.name]: inputValue,
    }));

    // 如果是空字符串，使用默认值
    if (inputValue.trim() === '') {
      onChange(variable.name, variable.defaultValue);
      return;
    }

    // 解析数字
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onChange(variable.name, num);
    }
  };

  const handleNumberInputBlur = (variable: ReplacementVariable, inputValue: string) => {
    // 取消编辑状态
    editingRef.current[variable.name] = false;

    // 失去焦点时，标准化显示
    const num = parseFloat(inputValue);
    const finalValue = isNaN(num) ? variable.defaultValue : num;

    setNumberInputs((prev) => ({
      ...prev,
      [variable.name]: String(finalValue),
    }));

    onChange(variable.name, finalValue);
  };

  const handleStringInputChange = (variable: ReplacementVariable, inputValue: string) => {
    onChange(variable.name, inputValue);
  };

  const handleSelectChange = (variable: ReplacementVariable, selectedValue: string) => {
    const parsedValue = selectedValue === 'true';
    onChange(variable.name, parsedValue);
  };

  // 获取显示值
  const getDisplayValue = (variable: ReplacementVariable): string => {
    if (variable.type === 'NUMBER') {
      // 如果有本地输入状态，使用本地状态
      if (numberInputs[variable.name] !== undefined) {
        return numberInputs[variable.name];
      }
      // 否则使用父组件传入的值
      const value = values[variable.name];
      return value !== undefined && value !== null
        ? String(value)
        : String(variable.defaultValue);
    }

    const value = values[variable.name];
    if (value === undefined || value === null) {
      return String(variable.defaultValue);
    }
    return String(value);
  };

  const renderInput = (variable: ReplacementVariable) => {
    if (variable.type === 'BOOLEAN') {
      return (
        <Select
          label={variable.label}
          value={getDisplayValue(variable)}
          options={BOOLEAN_OPTIONS}
          onChange={(value) => handleSelectChange(variable, value)}
          helperText={variable.description}
        />
      );
    }

    if (variable.type === 'NUMBER') {
      return (
        <Input
          label={variable.label}
          type="number"
          step="any"
          value={getDisplayValue(variable)}
          onChange={(e) => handleNumberInputChange(variable, e.target.value)}
          onBlur={(e) => handleNumberInputBlur(variable, e.target.value)}
          helperText={variable.description}
        />
      );
    }

    // STRING type
    return (
      <Input
        label={variable.label}
        type="text"
        value={getDisplayValue(variable)}
        onChange={(e) => handleStringInputChange(variable, e.target.value)}
        helperText={variable.description}
      />
    );
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>配置参数</label>
      <div className={styles.form}>
        {variables.map((variable) => (
          <div key={variable.name} className={styles.field}>
            {renderInput(variable)}
          </div>
        ))}
      </div>
    </div>
  );
}
