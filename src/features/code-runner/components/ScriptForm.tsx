/**
 * 脚本表单组件
 * 用于创建和编辑脚本
 */

import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SearchableSelect } from '@/components/SearchableSelect';
import { TextArea } from '@/components/TextArea';
import type { AdminScriptDetail, CreateScriptRequest, VariableDefinitionInput } from '../types/admin';
import styles from './ScriptForm.module.css';

/**
 * 将 Excel 复制的制表符分隔数据转换为标准 CSV 格式
 * 处理包含特殊字符（逗号、引号、换行）的单元格
 */
function convertToCSV(text: string): string {
  // 检测是否包含制表符（Excel 复制的数据特征）
  if (!text.includes('\t')) {
    return text; // 已经是 CSV 或其他格式，不处理
  }

  const lines = text.split(/\r?\n/);
  const csvLines = lines.map((line) => {
    if (!line.trim()) return '';
    
    const cells = line.split('\t');
    const csvCells = cells.map((cell) => {
      const trimmed = cell.trim();
      // 如果单元格包含逗号、引号或换行符，需要用引号包裹并转义内部引号
      if (trimmed.includes(',') || trimmed.includes('"') || trimmed.includes('\n')) {
        return `"${trimmed.replace(/"/g, '""')}"`;
      }
      return trimmed;
    });
    return csvCells.join(',');
  });

  return csvLines.filter((line) => line).join('\n');
}

interface ScriptFormProps {
  initialData?: AdminScriptDetail;
  onSubmit: (data: CreateScriptRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string;
  chapterOptions?: string[];
}

const EMPTY_VARIABLE: VariableDefinitionInput = {
  name: '',
  label: '',
  type: 'STRING',
  defaultValue: '',
  description: '',
};

export function ScriptForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
  chapterOptions = [],
}: ScriptFormProps) {
  const [codeFullScreen, setCodeFullScreen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    chapter: '',
    scriptContent: '',
    supportsVariables: false,
    supportsFileInput: false,
    fileInputDesc: '',
    exampleData: '',
  });
  const [variables, setVariables] = useState<VariableDefinitionInput[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        chapter: initialData.chapter || '',
        scriptContent: initialData.scriptContent || '',
        supportsVariables: initialData.supportsVariables || false,
        supportsFileInput: initialData.supportsFileInput || false,
        fileInputDesc: initialData.fileInputDesc || '',
        exampleData: initialData.exampleData || '',
      });

      if (initialData.variables) {
        setVariables(
          initialData.variables.map((v, index) => ({
            name: v.name,
            label: v.label,
            type: v.type.toUpperCase() as 'NUMBER' | 'STRING' | 'BOOLEAN',
            defaultValue: String(v.defaultValue || ''),
            description: v.description || '',
            sortOrder: index + 1,
          }))
        );
      }
    }
  }, [initialData]);

  // 专用于 Monaco 编辑器的代码变更
  const handleScriptContentChange = (val: string) => {
    setFormData((prev) => ({ ...prev, scriptContent: val }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddVariable = () => {
    setVariables((prev) => [
      ...prev,
      { ...EMPTY_VARIABLE, sortOrder: prev.length + 1 },
    ]);
  };

  const handleRemoveVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariableChange = (
    index: number,
    field: keyof VariableDefinitionInput,
    value: string
  ) => {
    setVariables((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };

  // 处理示例数据粘贴，自动转换 Excel 格式为 CSV
  const handleExampleDataPaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedText = e.clipboardData.getData('text');
      if (pastedText.includes('\t')) {
        e.preventDefault();
        const csvText = convertToCSV(pastedText);
        setFormData((prev) => ({
          ...prev,
          exampleData: csvText,
        }));
      }
    },
    []
  );

  // 手动转换当前示例数据为 CSV
  const handleConvertToCSV = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      exampleData: convertToCSV(prev.exampleData),
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateScriptRequest = {
      name: formData.name,
      description: formData.description || undefined,
      chapter: formData.chapter || undefined,
      scriptContent: formData.scriptContent,
      supportsVariables: formData.supportsVariables,
      supportsFileInput: formData.supportsFileInput,
      fileInputDesc: formData.supportsFileInput ? formData.fileInputDesc : undefined,
      exampleData: formData.supportsFileInput ? formData.exampleData : undefined,
      variables: formData.supportsVariables && variables.length > 0
        ? variables.map((v, i) => ({ ...v, sortOrder: i + 1 }))
        : undefined,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className={styles.card}>
        <h2 className={styles.sectionTitle}>基本信息</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            脚本名称 <span className={styles.required}>*</span>
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="如：线性回归分析"
            required
            maxLength={100}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>描述</label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="脚本的功能说明..."
            rows={3}
            maxLength={500}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>所属章节</label>
          <SearchableSelect
            value={formData.chapter}
            onChange={(value) => setFormData((prev) => ({ ...prev, chapter: value }))}
            placeholder="搜索或选择章节"
            options={chapterOptions}
            disabled={chapterOptions.length === 0}
          />
        </div>

        <div className={styles.formGroup}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className={styles.label}>
              R 脚本代码 <span className={styles.required}>*</span>
            </label>
            {!codeFullScreen && (
              <button
                type="button"
                onClick={() => setCodeFullScreen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 8 }}
                title="全屏编辑"
              >
                <MdFullscreen size={22} />
              </button>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <CodeEditor
              value={formData.scriptContent}
              onChange={handleScriptContentChange}
              language="r"
              height={codeFullScreen ? '90vh' : 400}
              fullScreen={codeFullScreen}
            />
            {codeFullScreen && (
              <button
                type="button"
                onClick={() => setCodeFullScreen(false)}
                title="退出全屏"
                style={{
                  position: 'fixed',
                  top: 24,
                  right: 32,
                  zIndex: 1300,
                  background: 'rgba(255,255,255,0.85)',
                  border: 'none',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MdFullscreenExit size={22} />
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card className={styles.card}>
        <h2 className={styles.sectionTitle}>运行选项</h2>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="supportsVariables"
              checked={formData.supportsVariables}
              onChange={handleCheckboxChange}
            />
            <span>支持自定义参数</span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="supportsFileInput"
              checked={formData.supportsFileInput}
              onChange={handleCheckboxChange}
            />
            <span>支持文件输入</span>
          </label>
        </div>

        {formData.supportsFileInput && (
          <div className={styles.subSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>文件输入说明</label>
              <Input
                name="fileInputDesc"
                value={formData.fileInputDesc}
                onChange={handleInputChange}
                placeholder="如：请上传包含 x 和 y 两列数据的 CSV 文件"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>CSV 示例数据</label>
              <TextArea
                name="exampleData"
                value={formData.exampleData}
                onChange={handleInputChange}
                onPaste={handleExampleDataPaste}
                placeholder="x,y&#10;1,2.3&#10;2,4.1&#10;3,6.5"
                rows={4}
                className={styles.codeEditor}
              />
              <div className={styles.hintRow}>
                <p className={styles.hint}>
                  从 Excel 粘贴数据会自动转换为 CSV 格式
                </p>
                {formData.exampleData.includes('\t') && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleConvertToCSV}
                  >
                    转换为 CSV
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {formData.supportsVariables && (
        <Card className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>变量定义</h2>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddVariable}>
              + 添加变量
            </Button>
          </div>

          {variables.length === 0 ? (
            <p className={styles.emptyHint}>暂无变量，点击上方按钮添加</p>
          ) : (
            <div className={styles.variableList}>
              {variables.map((variable, index) => (
                <div key={index} className={styles.variableItem}>
                  <div className={styles.variableHeader}>
                    <span className={styles.variableIndex}>变量 {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariable(index)}
                    >
                      删除
                    </Button>
                  </div>

                  <div className={styles.variableFields}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        变量名 <span className={styles.required}>*</span>
                      </label>
                      <Input
                        value={variable.name}
                        onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                        placeholder="如：sample_size"
                        required
                        pattern="^[a-zA-Z_][a-zA-Z0-9_]*$"
                        title="只能包含字母、数字、下划线，且不能以数字开头"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        显示标签 <span className={styles.required}>*</span>
                      </label>
                      <Input
                        value={variable.label}
                        onChange={(e) => handleVariableChange(index, 'label', e.target.value)}
                        placeholder="如：样本数量"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>类型</label>
                      <select
                        className={styles.select}
                        value={variable.type}
                        onChange={(e) => handleVariableChange(index, 'type', e.target.value)}
                      >
                        <option value="STRING">文本 (STRING)</option>
                        <option value="NUMBER">数值 (NUMBER)</option>
                        <option value="BOOLEAN">布尔 (BOOLEAN)</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>默认值</label>
                      <Input
                        value={variable.defaultValue || ''}
                        onChange={(e) => handleVariableChange(index, 'defaultValue', e.target.value)}
                        placeholder="默认值"
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>说明</label>
                      <Input
                        value={variable.description || ''}
                        onChange={(e) => handleVariableChange(index, 'description', e.target.value)}
                        placeholder="变量用途说明"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          取消
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? '保存修改' : '创建脚本'}
        </Button>
      </div>
    </form>
  );
}
