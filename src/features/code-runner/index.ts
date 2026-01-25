/**
 * code-runner 特性模块
 * 
 * 用于执行 R 语言代码，支持灵活的运行选项：
 * 1. 直接运行 - 使用默认参数
 * 2. 变量替换 - 自定义参数运行（可选）
 * 3. 文件输入 - 上传 CSV 或输入数据（可选）
 * 
 * 注意：变量替换和文件输入可以组合使用
 */

// 导出主组件
export { CodeRunner } from './components';

// 导出子组件（按需使用）
export {
  ScriptSelector,
  ModeSelector,
  VariablesForm,
  FileInput,
  ExecutionResult,
} from './components';

// 导出 hooks
export { useScripts, useScript, useExecuteCode } from './hooks';

// 导出类型
export type {
  RunOptions,
  ReplacementVariable,
  CodeScript,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
  TextOutput,
  ImageOutput,
  OutputItem,
  ExecutionStatus,
} from './types';
