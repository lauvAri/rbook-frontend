/**
 * 代码执行器 - 类型定义
 */

/** 运行选项（可组合） */
export interface RunOptions {
  /** 是否使用自定义变量 */
  useVariables: boolean;
  /** 是否使用文件输入 */
  useFileInput: boolean;
}

/** 可替换变量的类型 */
export interface ReplacementVariable {
  name: string;
  label: string;
  type: 'number' | 'string' | 'boolean';
  defaultValue: string | number | boolean;
  description?: string;
}

/** 代码脚本配置 */
export interface CodeScript {
  id: string;
  name: string;
  description: string;
  /** 所属章节 */
  chapter?: string;
  /** 是否支持变量替换 */
  supportsVariables?: boolean;
  /** 是否支持文件输入 */
  supportsFileInput?: boolean;
  /** 可替换的变量 */
  variables?: ReplacementVariable[];
  /** 文件输入的描述 */
  fileInputDescription?: string;
  /** CSV 示例数据，展示给用户参考 */
  exampleData?: string;
  /** R 脚本代码内容 */
  scriptContent?: string;
}

/** 代码执行请求 */
export interface ExecuteCodeRequest {
  scriptId: string;
  /** 变量替换值 */
  variables?: Record<string, string | number | boolean>;
  /** CSV 文件数据（base64 或原始文本） */
  fileData?: string;
  /** 是否为原始文本输入（非文件上传） */
  isRawInput?: boolean;
}

/** 执行结果 - 文本输出 */
export interface TextOutput {
  type: 'text';
  content: string;
}

/** 执行结果 - 图片输出 */
export interface ImageOutput {
  type: 'image';
  /** base64 编码的图片数据 */
  data: string;
  /** 图片格式 */
  format: 'png' | 'jpeg' | 'svg';
  /** 可选的图片说明 */
  caption?: string;
}

/** 执行结果输出项 */
export type OutputItem = TextOutput | ImageOutput;

/** 代码执行响应 */
export interface ExecuteCodeResponse {
  success: boolean;
  /** 执行输出列表 */
  outputs: OutputItem[];
  /** 错误信息（执行失败时） */
  error?: string;
  /** 执行耗时（毫秒） */
  executionTime?: number;
}

/** 执行状态 */
export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

// 导出管理接口类型
export * from './admin';
