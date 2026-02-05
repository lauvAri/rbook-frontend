/**
 * 代码执行器 - 模拟API服务
 * 
 * 由于后端API结构还不确定，这里提供模拟数据和服务
 * 后续替换为真实API时，只需修改此文件
 */

import type {
  CodeScript,
  ExecuteCodeRequest,
  ExecuteCodeResponse,
  OutputItem,
} from '../types';

/** 模拟的脚本列表 */
export const mockScripts: CodeScript[] = [
  {
    id: 'basic-stats',
    name: '基础统计分析',
    description: '计算数据的基本统计量，包括均值、中位数、标准差等',
    supportsVariables: false,
    supportsFileInput: true,
    fileInputDescription: '请上传包含数值数据的 CSV 文件（第一列将被分析）',
    exampleData: `value
12.5
15.3
18.7
22.1
25.6
19.8
21.3`,
  },
  {
    id: 'linear-regression',
    name: '线性回归分析',
    description: '执行简单线性回归分析并生成回归图，支持自定义参数和上传数据',
    supportsVariables: true,
    supportsFileInput: true,
    variables: [
      {
        name: 'sample_size',
        label: '样本数量',
        type: 'number',
        defaultValue: 100,
        description: '生成的样本数量（10-1000）',
      },
      {
        name: 'noise_level',
        label: '噪声水平',
        type: 'number',
        defaultValue: 0.5,
        description: '数据噪声水平（0-1）',
      },
    ],
    fileInputDescription: '请上传包含 x 和 y 两列数据的 CSV 文件',
    exampleData: `x,y
1,2.3
2,4.1
3,6.2
4,7.8
5,10.1
6,12.3
7,14.0`,
  },
  {
    id: 'histogram',
    name: '直方图生成',
    description: '生成数据分布的直方图可视化',
    supportsVariables: true,
    supportsFileInput: true,
    variables: [
      {
        name: 'bins',
        label: '分组数量',
        type: 'number',
        defaultValue: 20,
        description: '直方图的分组数量（5-50）',
      },
      {
        name: 'title',
        label: '图表标题',
        type: 'string',
        defaultValue: '数据分布直方图',
        description: '图表显示的标题',
      },
    ],
    fileInputDescription: '上传数据后将根据数据生成直方图',
    exampleData: `score
85
92
78
88
95
76
82
90
87
91`,
  },
  {
    id: 'correlation-matrix',
    name: '相关性矩阵',
    description: '计算并可视化多变量之间的相关性',
    supportsVariables: false,
    supportsFileInput: true,
    fileInputDescription: '请上传包含多列数值数据的 CSV 文件',
    exampleData: `x1,x2,x3,x4
1.2,2.3,3.1,4.5
2.1,3.2,4.0,5.3
3.0,4.1,5.2,6.1
4.2,5.0,6.1,7.2
5.1,6.2,7.0,8.0`,
  },
  {
    id: 'quick-summary',
    name: '快速数据摘要',
    description: '快速生成内置示例数据的统计摘要',
    supportsVariables: false,
    supportsFileInput: false,
  },
];

/** 模拟的示例图片（base64 SVG） */
const mockChartSvg = `PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyI+56S65L6L5Zu+6KGoPC90ZXh0PgogIDxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzA5ODRlMyIvPgogIDxyZWN0IHg9IjExMCIgeT0iODAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMwOTg0ZTMiLz4KICA8cmVjdCB4PSIxNzAiIHk9IjEyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjExMCIgZmlsbD0iIzA5ODRlMyIvPgogIDxyZWN0IHg9IjIzMCIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiMwOTg0ZTMiLz4KICA8cmVjdCB4PSIyOTAiIHk9IjEwMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjEzMCIgZmlsbD0iIzA5ODRlMyIvPgogIDxsaW5lIHgxPSI0MCIgeTE9IjIzMCIgeDI9IjM1MCIgeTI9IjIzMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iNDAiIHkxPSI0MCIgeDI9IjQwIiB5Mj0iMjMwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjcwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPkE8L3RleHQ+CiAgPHRleHQgeD0iMTMwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPkI8L3RleHQ+CiAgPHRleHQgeD0iMTkwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPkM8L3RleHQ+CiAgPHRleHQgeD0iMjUwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPkQ8L3RleHQ+CiAgPHRleHQgeD0iMzEwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPkU8L3RleHQ+Cjwvc3ZnPg==`;

/** 模拟执行延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** 获取脚本列表 */
export async function fetchScripts(): Promise<CodeScript[]> {
  await delay(300);
  return mockScripts;
}

/** 获取单个脚本详情 */
export async function fetchScript(scriptId: string): Promise<CodeScript | null> {
  await delay(200);
  return mockScripts.find(s => s.id === scriptId) || null;
}

/** 执行代码 */
export async function executeCode(request: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
  await delay(1500 + Math.random() * 1000); // 模拟 1.5-2.5 秒执行时间

  const script = mockScripts.find(s => s.id === request.scriptId);
  if (!script) {
    return {
      success: false,
      outputs: [],
      error: `未找到脚本：${request.scriptId}`,
    };
  }

  // 模拟不同脚本的输出
  const outputs: OutputItem[] = [];

  switch (request.scriptId) {
    case 'basic-stats':
      outputs.push({
        type: 'text',
        content: `=== 基础统计分析结果 ===

样本数量: 150
最小值: 12.34
最大值: 98.76
平均值: 52.45
中位数: 51.23
标准差: 18.67
方差: 348.57
四分位数:
  Q1 (25%): 38.21
  Q2 (50%): 51.23
  Q3 (75%): 67.89

数据分布: 近似正态分布
偏度: 0.12 (略微右偏)
峰度: -0.34 (略微平坦)`,
      });
      break;

    case 'linear-regression': {
      const sampleSize = request.variables?.sample_size ?? 100;
      const noiseLevel = request.variables?.noise_level ?? 0.5;
      outputs.push({
        type: 'text',
        content: `=== 线性回归分析结果 ===

模型参数:
  样本数量: ${sampleSize}
  噪声水平: ${noiseLevel}

回归方程: y = 2.34x + 5.67

统计指标:
  R² (决定系数): 0.876
  调整 R²: 0.873
  标准误差: 4.56
  F 统计量: 698.45 (p < 0.001)

系数估计:
  截距: 5.67 (SE: 0.89, t: 6.37, p < 0.001)
  斜率: 2.34 (SE: 0.09, t: 26.43, p < 0.001)

残差分析:
  残差均值: 0.00
  残差标准差: 4.52`,
      });
      outputs.push({
        type: 'image',
        data: mockChartSvg,
        format: 'svg',
        caption: '线性回归拟合图',
      });
      break;
    }

    case 'histogram': {
      const bins = request.variables?.bins ?? 20;
      const title = request.variables?.title ?? '数据分布直方图';
      outputs.push({
        type: 'text',
        content: `=== 直方图统计 ===

图表标题: ${title}
分组数量: ${bins}
数据范围: [0, 100]
每组宽度: ${(100 / Number(bins)).toFixed(2)}

频数分布摘要:
  最高频数组: [45, 50) - 23 个
  最低频数组: [95, 100) - 2 个
  中心趋势: 数据集中在 40-60 区间`,
      });
      outputs.push({
        type: 'image',
        data: mockChartSvg,
        format: 'svg',
        caption: title as string,
      });
      break;
    }

    case 'correlation-matrix':
      outputs.push({
        type: 'text',
        content: `=== 相关性矩阵分析 ===

变量: X1, X2, X3, X4

相关系数矩阵:
        X1      X2      X3      X4
X1    1.000   0.756   -0.234   0.456
X2    0.756   1.000   -0.123   0.678
X3   -0.234  -0.123    1.000  -0.345
X4    0.456   0.678   -0.345   1.000

显著性水平 (p < 0.05):
  X1-X2: *** (p < 0.001)
  X1-X4: **  (p < 0.01)
  X2-X4: *** (p < 0.001)
  其他相关性不显著

强相关对:
  X1 与 X2: 强正相关 (r = 0.756)
  X2 与 X4: 中等正相关 (r = 0.678)`,
      });
      outputs.push({
        type: 'image',
        data: mockChartSvg,
        format: 'svg',
        caption: '相关性热力图',
      });
      break;

    case 'quick-summary':
      outputs.push({
        type: 'text',
        content: `=== 快速数据摘要 ===

使用内置 iris 数据集

数据维度: 150 行 × 5 列
列名: Sepal.Length, Sepal.Width, Petal.Length, Petal.Width, Species

数值列摘要:
  Sepal.Length: 均值=5.84, 标准差=0.83
  Sepal.Width:  均值=3.06, 标准差=0.44
  Petal.Length: 均值=3.76, 标准差=1.77
  Petal.Width:  均值=1.20, 标准差=0.76

分类变量:
  Species: setosa(50), versicolor(50), virginica(50)`,
      });
      break;

    default:
      outputs.push({
        type: 'text',
        content: '执行完成，但没有特定的输出内容。',
      });
  }

  return {
    success: true,
    outputs,
    executionTime: 1500 + Math.floor(Math.random() * 1000),
  };
}
