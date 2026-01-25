/**
 * 变量表单组件
 */

import { Input } from '@/components';
import type { ReplacementVariable } from '../types';
import styles from './VariablesForm.module.css';

interface VariablesFormProps {
  variables: ReplacementVariable[];
  values: Record<string, string | number | boolean>;
  onChange: (name: string, value: string | number | boolean) => void;
}

export function VariablesForm({ variables, values, onChange }: VariablesFormProps) {
  const handleChange = (variable: ReplacementVariable, inputValue: string) => {
    let parsedValue: string | number | boolean = inputValue;

    if (variable.type === 'number') {
      // 确保数值类型正确解析，空字符串使用默认值
      const num = parseFloat(inputValue);
      parsedValue = isNaN(num) ? variable.defaultValue : num;
    } else if (variable.type === 'boolean') {
      parsedValue = inputValue === 'true';
    }

    onChange(variable.name, parsedValue);
  };

  // 获取显示值，确保类型正确
  const getDisplayValue = (variable: ReplacementVariable): string => {
    const value = values[variable.name];
    if (value === undefined || value === null) {
      return String(variable.defaultValue);
    }
    return String(value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>配置参数</label>
      <div className={styles.form}>
        {variables.map((variable) => (
          <div key={variable.name} className={styles.field}>
            <Input
              label={variable.label}
              type={variable.type === 'number' ? 'number' : 'text'}
              value={getDisplayValue(variable)}
              onChange={(e) => handleChange(variable, e.target.value)}
              helperText={variable.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
