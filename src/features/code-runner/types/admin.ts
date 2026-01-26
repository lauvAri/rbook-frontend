/**
 * 管理接口 - 类型定义
 */

import type { ReplacementVariable } from './index';

/** 变量定义（创建/更新时使用） */
export interface VariableDefinitionInput {
  name: string;
  label: string;
  type: 'NUMBER' | 'STRING' | 'BOOLEAN';
  defaultValue?: string;
  description?: string;
  sortOrder?: number;
}

/** 脚本详情（管理端返回） */
export interface AdminScriptDetail {
  id: string;
  name: string;
  description?: string;
  /** 所属章节 */
  chapter?: string;
  scriptContent?: string;
  supportsVariables: boolean;
  supportsFileInput: boolean;
  fileInputDesc?: string;
  exampleData?: string;
  variables?: ReplacementVariable[];
}

/** 创建脚本请求 */
export interface CreateScriptRequest {
  name: string;
  description?: string;
  /** 所属章节 */
  chapter?: string;
  scriptContent: string;
  supportsVariables?: boolean;
  supportsFileInput?: boolean;
  fileInputDesc?: string;
  exampleData?: string;
  variables?: VariableDefinitionInput[];
}

/** 更新脚本请求 */
export interface UpdateScriptRequest {
  name: string;
  description?: string;
  /** 所属章节 */
  chapter?: string;
  scriptContent?: string;
  supportsVariables?: boolean;
  supportsFileInput?: boolean;
  fileInputDesc?: string;
  exampleData?: string;
  variables?: VariableDefinitionInput[];
}

/** 章节详情（管理端） */
export interface AdminChapter {
  id: number;
  name: string;
  sortOrder: number;
  scriptCount: number;
}

/** 创建章节请求 */
export interface CreateChapterRequest {
  name: string;
  sortOrder?: number;
}

/** 更新章节请求 */
export interface UpdateChapterRequest {
  name: string;
  sortOrder?: number;
}
