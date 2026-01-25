## 脚本名称

BMI与胆固醇相关性分析

## 描述

#### 🩺 课题：身体质量指数(BMI)对胆固醇的影响

**背景介绍**
高胆固醇是心血管疾病的主要风险因素。本分析旨在探究 BMI 是否能作为预测胆固醇水平的有效指标

**数学模型**
我们假设两者存在线性关系，且基础胆固醇为 150，BMI 每增加 1 单位，胆固醇增加 2.5 单位：$$ Y_i = 150 + 2.5 X_i + \epsilon_i $$

**数据示例**
系统模拟或上传的数据应符合以下结构（下表数据仅供参考，符合上述数学模型）
| 病例 ID | BMI ($X$) | 胆固醇 ($Y$) | 说明 |
| :--- | :--- | :--- | :--- |
| 1 | 20.0 | 200.0 | $150 + 2.5 \\times 20$ |
| 2 | 24.0 | 210.0 | 标准体重样本 |
| 3 | 28.0 | 220.0 | 超重样本 |
| 4 | 32.0 | 230.0 | 肥胖样本 |

**任务要求**
请点击“执行”运行模拟数据，或上传真实的临床 CSV 数据进行回归验证。

## R脚本代码

```R
# ========================================================
# 脚本名称: BMI与胆固醇相关性分析
# ========================================================

library(ggplot2)

print(paste("正在读取上传的数据文件:", input_file))
data <- read.csv(input_file)
if (!all(c("bmi", "cholesterol") %in% names(data))) {
  stop("错误: CSV 文件必须包含 'bmi' 和 'cholesterol' 两列")
}

# --- 3. 数据过滤 ---
# 替换变量测试点：使用 bmi_threshold
data_filtered <- subset(data, bmi >= as.numeric(bmi_threshold))
print(paste("已过滤 BMI <", bmi_threshold, "的数据。剩余记录:", nrow(data_filtered)))

# --- 4. 统计分析 ---
model <- lm(cholesterol ~ bmi, data=data_filtered)
print("=== 线性回归结果 ===")
print(summary(model))

# --- 5. 绘图 ---
p <- ggplot(data_filtered, aes(x=bmi, y=cholesterol)) +
  geom_point(alpha=0.5, color="#0984e3") + 
  geom_smooth(method="lm", color="#d63031", se=as.logical(show_confidence)) +
  labs(
    title = "BMI 与 胆固醇水平回归分析",
    subtitle = paste("拟合公式: y =", round(coef(model)[1], 1), "+", round(coef(model)[2], 2), "x"),
    x = "BMI (身体质量指数)",
    y = "Total Cholesterol (mg/dL)"
  ) +
  theme_minimal() +
  # 在图上标注题目描述中的理论公式，方便对比
  annotate("text", x=min(data_filtered$bmi), y=max(data_filtered$cholesterol), 
           label="理论模型: Y = 150 + 2.5X", hjust=0, vjust=1, color="darkgreen", size=4)

print(p)
```

## 自定义参数

**参数1**：

变量名：bmi_threshold

显示标签：BMI 过滤阈值

类型：NUMBER

默认值：18.5

说明：仅分析 BMI 大于此值的患者数据

**参数2**：

变量名：show_confidence

显示标签：显示置信区间

类型：BOOLEAN

默认值：true

说明：在图表中显示 95% 置信区间阴影

## 文件输入

**文件输入说明**：

数据数据为两列，第一列为bmi,第二列为cholesterol，列与列以逗号分隔

**CSV示例数据**：

```csv
bmi,cholesterol
20.0,201.5
20.0,198.2
24.0,209.5
24.0,212.0
28.0,218.0
28.0,225.5
32.0,228.0
32.0,235.0
18.0,190.0
35.0,240.0
```