/**
 * 变量表单组件
 */

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
  const handleInputChange = (variable: ReplacementVariable, inputValue: string) => {
    let parsedValue: string | number | boolean = inputValue;

    if (variable.type === 'NUMBER') {
      // 确保数值类型正确解析，空字符串使用默认值
      const num = parseFloat(inputValue);
      parsedValue = isNaN(num) ? variable.defaultValue : num;
    }

    onChange(variable.name, parsedValue);
  };

  const handleSelectChange = (variable: ReplacementVariable, selectedValue: string) => {
    const parsedValue = selectedValue === 'true';
    onChange(variable.name, parsedValue);
  };

  // 获取显示值
  const getDisplayValue = (variable: ReplacementVariable): string => {
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
          value={getDisplayValue(variable)}
          onChange={(e) => handleInputChange(variable, e.target.value)}
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
        onChange={(e) => handleInputChange(variable, e.target.value)}
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
