# Code Runner API 文档

> **模块说明**：代码执行器用于管理和执行 R 语言脚本，返回文本和图片结果。

## 基础信息

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

## 接口列表

### 验证码接口

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取验证码 | GET | `/captcha` | 获取图片验证码 |

### 用户认证接口

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 用户登录 | POST | `/user/login` | 用户登录（需验证码） |
| 用户登出 | POST | `/user/logout` | 用户登出 |
| 用户注册 | POST | `/user/register` | 注册新用户 |
| 批量导入用户 | POST | `/user/batch-import` | 批量创建用户 |
| 重置密码 | PUT | `/user/{id}/reset-password` | 重置用户密码（重置为123456） |
| 修改密码 | PUT | `/user/{id}/change-password` | 用户本人修改密码 |
| 获取用户列表 | GET | `/user/list` | 获取所有用户列表 |
| 获取用户信息 | GET | `/user/{id}` | 获取单个用户信息 |
| 删除用户 | DELETE | `/user/{id}` | 删除用户 |
| 获取用户日志 | GET | `/user/{userId}/logs` | 获取用户操作日志 |
| 获取所有日志 | GET | `/user/logs` | 分页获取所有操作日志 |

### 脚本用户接口

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取章节列表 | GET | `/code-runner/chapters` | 获取所有章节列表 |
| 获取脚本列表 | GET | `/code-runner/scripts` | 获取脚本列表（支持章节筛选） |
| 获取脚本详情 | GET | `/code-runner/scripts/{id}` | 获取单个脚本的详细信息 |
| 执行代码 | POST | `/code-runner/execute` | 执行指定的 R 脚本 |

### 脚本管理接口

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 创建脚本 | POST | `/code-runner/admin/scripts` | 创建新脚本 |
| 更新脚本 | PUT | `/code-runner/admin/scripts/{id}` | 更新脚本信息 |
| 删除脚本 | DELETE | `/code-runner/admin/scripts/{id}` | 删除脚本（逻辑删除） |

---

## 验证码接口

### 获取图片验证码

用于登录页面展示验证码图片。

**请求**

```
GET /api/captcha
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "captchaKey": "uuid-xxxx-xxxx",
    "captchaImage": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| captchaKey | string | 验证码唯一标识，登录时需回传 |
| captchaImage | string | Base64 编码的验证码图片（含 data URI 前缀） |

---

## 用户认证接口

### 1. 用户登录

用户登录验证（需要验证码）。

**请求**

```
POST /api/user/login
```

**请求体**

```json
{
  "username": "admin",
  "password": "admin123",
  "captchaKey": "uuid-xxxx-xxxx",
  "captchaCode": "a8x2"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| captchaKey | string | 是 | 验证码标识（从获取验证码接口获得） |
| captchaCode | string | 是 | 用户输入的验证码 |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "userType": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
}
```

**验证码错误响应**

```json
{
  "code": 500,
  "message": "验证码错误或已过期",
  "data": null
}
```

---

### 2. 用户登出

用户主动退出登录，清除服务端会话。

**请求**

```
POST /api/user/logout
```

**请求头**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| Authorization | string | 否 | 用户令牌 |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

### 3. 用户注册

注册新用户（需要管理员权限）。

**请求**

```
POST /api/user/register
```

**请求体**

```json
{
  "username": "worker1",
  "password": "password123",
  "userType": "WORKER"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| userType | string | 是 | 用户类型：`ADMIN`（管理员）或 `WORKER`（工人） |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 2,
    "username": "worker1",
    "userType": "WORKER",
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

---

### 4. 批量导入用户

管理员批量创建 Worker 用户。

**请求**

```
POST /api/user/batch-import
```

**请求体**

```json
{
  "users": [
    {
      "username": "worker001",
      "password": "password123"
    },
    {
      "username": "worker002"
    }
  ]
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| users | array | 是 | 用户列表 |
| users[].username | string | 是 | 用户名 |
| users[].password | string | 否 | 密码（不传则系统自动生成） |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 2,
    "successCount": 2,
    "failedCount": 0,
    "results": [
      {
        "username": "worker001",
        "success": true,
        "userId": 10,
        "password": "password123",
        "message": null
      },
      {
        "username": "worker002",
        "success": true,
        "userId": 11,
        "password": "Abc@12345",
        "message": null
      }
    ]
  }
}
```

**部分失败响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 2,
    "successCount": 1,
    "failedCount": 1,
    "results": [
      {
        "username": "worker001",
        "success": true,
        "userId": 10,
        "password": "password123",
        "message": null
      },
      {
        "username": "admin",
        "success": false,
        "userId": null,
        "password": null,
        "message": "用户名已存在"
      }
    ]
  }
}
```

> **说明**: 批量导入采用"尽可能成功"策略，部分失败不影响其他用户创建。

---

### 5. 重置用户密码

管理员重置指定用户的密码，密码将被重置为固定值 `123456`。

**请求**

```
PUT /api/user/{id}/reset-password
```

**路径参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | number | 是 | 用户 ID |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 2,
    "username": "worker1",
    "newPassword": "123456"
  }
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| userId | number | 用户 ID |
| username | string | 用户名 |
| newPassword | string | 新密码（固定为123456，仅此次返回） |

> **前端用途**: 管理员重置后，在界面上显示新密码供管理员告知用户。

---

### 6. 用户本人修改密码

用户本人可修改自己的密码，需提供原密码和新密码。

**请求**

```
PUT /api/user/{id}/change-password
```

**请求头**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| Authorization | string | 是 | 用户令牌（Bearer ...） |

**请求体**

```json
{
  "oldPassword": "原密码",
  "newPassword": "新密码"
}
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| oldPassword | string | 是 | 原密码 |
| newPassword | string | 是 | 新密码 |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**失败响应**

```json
{
  "code": 403,
  "message": "只能修改自己的密码",
  "data": null
}
```

```json
{
  "code": 500,
  "message": "原密码错误",
  "data": null
}
```

---

### 6. 获取用户列表

获取所有用户列表。

**请求**

```
GET /api/user/list
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "userType": "ADMIN",
      "createdAt": "2025-01-01T00:00:00",
      "updatedAt": "2025-01-01T00:00:00"
    },
    {
      "id": 2,
      "username": "worker1",
      "userType": "WORKER",
      "createdAt": "2025-01-15T10:30:00",
      "updatedAt": "2025-01-15T10:30:00"
    }
  ]
}
```

---

### 7. 获取用户信息

根据用户ID获取用户详细信息。

**请求**

```
GET /api/user/{id}
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "userType": "ADMIN",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
}
```

---

### 8. 删除用户

删除指定用户。

**请求**

```
DELETE /api/user/{id}
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

### 9. 获取用户操作日志

获取指定用户的操作日志。

**请求**

```
GET /api/user/{userId}/logs
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "operationType": "CREATE_SCRIPT",
      "operationDesc": "新增题目",
      "scriptId": "script-abc123",
      "createdAt": "2025-01-15T10:30:00"
    },
    {
      "id": 2,
      "userId": 1,
      "operationType": "UPDATE_SCRIPT",
      "operationDesc": "修改题目",
      "scriptId": "script-abc123",
      "createdAt": "2025-01-15T11:00:00"
    }
  ]
}
```

---

### 10. 获取所有操作日志（分页）

分页获取所有用户的操作日志。

**请求**

```
GET /api/user/logs?page=0&size=20
```

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|------|------|
| page | int | 否 | 0 | 页码（从0开始） |
| size | int | 否 | 20 | 每页数量 |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 1,
        "operationType": "CREATE_SCRIPT",
        "operationDesc": "新增题目",
        "scriptId": "script-abc123",
        "createdAt": "2025-01-15T10:30:00"
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "size": 20,
    "number": 0
  }
}
```

---

## 脚本用户接口

### 1. 获取章节列表

获取所有章节及其脚本数量。

**请求**

```
GET /api/code-runner/chapters
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "name": "第一章 描述性统计",
      "scriptCount": 5
    },
    {
      "name": "第二章 回归分析",
      "scriptCount": 3
    }
  ]
}
```

---

### 2. 获取脚本列表

获取脚本列表，支持按章节筛选。

**请求**

```
GET /api/code-runner/scripts?chapter={chapterName}
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| chapter | string | 否 | 章节名称，不传则返回全部 |

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "basic-stats",
      "name": "基础统计分析",
      "description": "计算数据的基本统计量，包括均值、中位数、标准差等",
      "supportsVariables": false,
      "supportsFileInput": true,
      "fileInputDesc": "请上传包含数值数据的 CSV 文件",
      "exampleData": "value\n23\n45\n67\n89",
      "chapter": "第一章 描述性统计",
      "sortOrder": 1,
      "scriptContent": "# 基础统计分析脚本\nif (exists(\"input_file\") && file.exists(input_file)) {\n  data <- read.csv(input_file)\n} else {\n  data <- data.frame(value = c(23, 45, 67, 89))\n}\nprint(summary(data))\nhist(data[[1]])",
      "variables": null
    },
    {
      "id": "linear-regression",
      "name": "线性回归分析",
      "description": "执行简单线性回归分析并生成回归图",
      "supportsVariables": true,
      "supportsFileInput": true,
      "fileInputDesc": "请上传包含 x 和 y 两列数据的 CSV 文件",
      "exampleData": "x,y\n1,2.3\n2,4.1\n3,6.5",
      "chapter": "第二章 回归分析",
      "sortOrder": 1,
      "scriptContent": "# 线性回归分析脚本\n...",
      "variables": [
        {
          "name": "sample_size",
          "label": "样本数量",
          "type": "NUMBER",
          "defaultValue": "100",
          "description": "生成的样本数量（10-1000）"
        },
        {
          "name": "noise_level",
          "label": "噪声水平",
          "type": "NUMBER",
          "defaultValue": "0.5",
          "description": "数据噪声水平（0-1）"
        }
      ]
    }
  ]
}
```

**响应字段说明**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 脚本唯一标识 |
| name | string | 脚本名称 |
| description | string | 脚本描述 |
| supportsVariables | boolean | 是否支持自定义参数 |
| supportsFileInput | boolean | 是否支持文件上传 |
| fileInputDesc | string | 文件上传提示文案 |
| exampleData | string | CSV 示例数据 |
| chapter | string | 所属章节名称 |
| sortOrder | integer | 在章节内的排序顺序 |
| scriptContent | string | R 脚本代码内容 |
| variables | array | 变量定义列表 |

---

### 3. 获取脚本详情

根据 ID 获取单个脚本的详细信息。

**请求**

```
GET /api/code-runner/scripts/{id}
```

**路径参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 脚本唯一标识 |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "linear-regression",
    "name": "线性回归分析",
    "description": "执行简单线性回归分析并生成回归图",
    "supportsVariables": true,
    "supportsFileInput": true,
    "fileInputDesc": "请上传包含 x 和 y 两列数据的 CSV 文件",
    "exampleData": "x,y\n1,2.3\n2,4.1\n3,6.5",
    "scriptContent": "# 线性回归分析脚本\n# === 由后端约定的变量 ===\n# input_file - CSV 文件路径\n# sample_size - 样本数量\n# noise_level - 噪声水平\n\ndata <- NULL\nif (exists(\"input_file\") && file.exists(input_file)) {\n  data <- read.csv(input_file)\n} else {\n  if (!exists(\"sample_size\")) sample_size <- 100\n  x <- 1:sample_size\n  y <- 2 * x + rnorm(sample_size)\n  data <- data.frame(x=x, y=y)\n}\n\nprint(summary(data))\nmodel <- lm(y ~ x, data=data)\nprint(summary(model))\nplot(data$x, data$y)\nabline(model, col=\"red\")",
    "variables": [
      {
        "name": "sample_size",
        "label": "样本数量",
        "type": "NUMBER",
        "defaultValue": "100",
        "description": "生成的样本数量（10-1000）"
      }
    ]
  }
}
```

**失败响应**

```json
{
  "code": 1002,
  "message": "脚本不存在",
  "data": null
}
```

---

### 4. 执行代码

执行指定的 R 脚本并返回结果。

**请求**

```
POST /api/code-runner/execute
```

**请求体**

```json
{
  "scriptId": "linear-regression",
  "variables": {
    "sample_size": 200,
    "noise_level": 0.3
  },
  "fileData": "x,y\n1,2.3\n2,4.1\n3,6.2",
  "isRawInput": true
}
```

**参数说明**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| scriptId | string | 是 | 要执行的脚本 ID |
| variables | object | 否 | 变量参数（键值对），当脚本支持变量时传入 |
| fileData | string | 否 | CSV 数据内容，当脚本支持文件输入时传入 |
| isRawInput | boolean | 否 | `true` 表示 fileData 是用户直接输入的文本 |

> **注意**: `variables` 和 `fileData` 可以同时传入。

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "success": true,
    "outputs": [
      {
        "type": "text",
        "content": "[1] \"Loading data from data.csv\"\n=== Data Summary ===\n      x               y        \n Min.   : 1.00   Min.   : 2.30  \n...",
        "data": null,
        "format": null,
        "caption": null
      },
      {
        "type": "image",
        "content": null,
        "data": "iVBORw0KGgoAAAANSUhEUgAAA...",
        "format": "png",
        "caption": "Result Plot"
      }
    ],
    "executionTime": 1523,
    "error": null
  }
}
```

**执行失败响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "success": false,
    "outputs": [
      {
        "type": "text",
        "content": "Error in read.csv(input_file) : 文件不存在",
        "data": null,
        "format": null,
        "caption": null
      }
    ],
    "executionTime": 112,
    "error": "R process exited with code 1"
  }
}
```

**参数校验失败**

```json
{
  "code": 1001,
  "message": "scriptId 不能为空",
  "data": null
}
```

---

## 管理接口

### 4. 创建脚本

创建一个新的 R 脚本。

**请求**

```
POST /api/code-runner/admin/scripts
```

**请求体**

```json
{
  "name": "我的分析脚本",
  "description": "这是一个自定义分析脚本",
  "scriptContent": "# R 脚本内容\nprint('Hello World')\n\n# 读取数据\nif (exists(\"input_file\") && file.exists(input_file)) {\n  data <- read.csv(input_file)\n  print(summary(data))\n}\n\n# 绘图\nplot(1:10, main=\"示例图表\")",
  "supportsVariables": true,
  "supportsFileInput": true,
  "fileInputDesc": "请上传 CSV 文件",
  "exampleData": "x,y\n1,2\n3,4\n5,6",
  "variables": [
    {
      "name": "sample_size",
      "label": "样本数量",
      "type": "NUMBER",
      "defaultValue": "100",
      "description": "生成的样本数量",
      "sortOrder": 1
    },
    {
      "name": "title",
      "label": "图表标题",
      "type": "STRING",
      "defaultValue": "My Chart",
      "description": "图表的标题文字",
      "sortOrder": 2
    }
  ]
}
```

**参数说明**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | string | 是 | 脚本名称（最大100字符） |
| description | string | 否 | 脚本描述（最大500字符） |
| scriptContent | string | 是 | R 脚本代码内容 |
| supportsVariables | boolean | 否 | 是否支持自定义参数，默认 `false` |
| supportsFileInput | boolean | 否 | 是否支持文件输入，默认 `false` |
| fileInputDesc | string | 否 | 文件输入的说明文字 |
| exampleData | string | 否 | CSV 示例数据 |
| variables | array | 否 | 变量定义列表 |

**变量定义参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | string | 是 | 变量名（R 代码中使用，只能包含字母、数字、下划线） |
| label | string | 是 | 前端显示的标签名 |
| type | string | 是 | 变量类型：`NUMBER`、`STRING`、`BOOLEAN` |
| defaultValue | string | 否 | 默认值 |
| description | string | 否 | 变量说明 |
| sortOrder | integer | 否 | 排序权重 |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "script-m5x8k2a1b3",
    "name": "我的分析脚本",
    "description": "这是一个自定义分析脚本",
    "supportsVariables": true,
    "supportsFileInput": true,
    "fileInputDesc": "请上传 CSV 文件",
    "exampleData": "x,y\n1,2\n3,4\n5,6",
    "variables": [
      {
        "name": "sample_size",
        "label": "样本数量",
        "type": "NUMBER",
        "defaultValue": "100",
        "description": "生成的样本数量"
      }
    ]
  }
}
```

> **注意**: `id` 由后端自动生成，格式为 `script-{时间戳}{随机字符}`

---

### 5. 更新脚本

更新已存在的脚本信息。

**请求**

```
PUT /api/code-runner/admin/scripts/{id}
```

**路径参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 脚本 ID |

**请求体**

```json
{
  "name": "更新后的名称",
  "description": "更新后的描述",
  "scriptContent": "# 新的 R 脚本代码\nprint('Updated!')",
  "supportsVariables": false,
  "supportsFileInput": true,
  "fileInputDesc": "新的文件说明",
  "exampleData": "col1,col2\na,1\nb,2",
  "variables": []
}
```

**参数说明**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | string | 是 | 脚本名称 |
| description | string | 否 | 脚本描述 |
| scriptContent | string | 否 | R 脚本代码（不传则不更新脚本文件） |
| supportsVariables | boolean | 否 | 是否支持自定义参数 |
| supportsFileInput | boolean | 否 | 是否支持文件输入 |
| fileInputDesc | string | 否 | 文件输入的说明文字 |
| exampleData | string | 否 | CSV 示例数据 |
| variables | array | 否 | 变量定义列表（传入则全量替换） |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "script-m5x8k2a1b3",
    "name": "更新后的名称",
    "description": "更新后的描述",
    "supportsVariables": false,
    "supportsFileInput": true,
    "fileInputDesc": "新的文件说明",
    "exampleData": "col1,col2\na,1\nb,2",
    "variables": []
  }
}
```

**失败响应**

```json
{
  "code": 1002,
  "message": "脚本不存在: invalid-id",
  "data": null
}
```

---

### 6. 删除脚本

删除指定的脚本（逻辑删除）。

**请求**

```
DELETE /api/code-runner/admin/scripts/{id}
```

**路径参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 脚本 ID |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**失败响应**

```json
{
  "code": 1002,
  "message": "脚本不存在",
  "data": null
}
```

---

## 数据类型定义

### ScriptDefinitionDTO

脚本定义信息。

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 脚本唯一标识 |
| name | string | 脚本名称 |
| description | string | 脚本描述 |
| supportsVariables | boolean | 是否支持变量 |
| supportsFileInput | boolean | 是否支持文件输入 |
| fileInputDesc | string | 文件输入说明 |
| exampleData | string | CSV 示例数据 |
| scriptContent | string | R 脚本代码内容 |
| variables | VariableDefinition[] | 变量定义列表 |

### VariableDefinition

变量定义。

| 字段 | 类型 | 描述 |
|------|------|------|
| name | string | 变量名（R 代码中使用） |
| label | string | 前端显示标签 |
| type | string | 变量类型：`NUMBER` / `STRING` / `BOOLEAN` |
| defaultValue | string | 默认值 |
| description | string | 变量说明 |

### OutputItem

输出项（联合类型）。

**文本输出 (type = "text")**

| 字段 | 类型 | 描述 |
|------|------|------|
| type | string | 固定值 `"text"` |
| content | string | 文本内容（支持换行符） |

**图片输出 (type = "image")**

| 字段 | 类型 | 描述 |
|------|------|------|
| type | string | 固定值 `"image"` |
| data | string | Base64 编码的图片数据 |
| format | string | 图片格式：`"png"` / `"jpeg"` |
| caption | string | 图片说明文字 |

---

## 错误码

| code | 描述 |
|------|------|
| 0 | 成功 |
| 400 | 参数校验失败 |
| 500 | 服务器内部错误 |
| 1001 | 参数错误 |
| 1002 | 脚本不存在 |
| 5000 | 系统错误 |

---

## 使用示例

### 场景 1：直接运行（无任何选项）

```json
// 请求
POST /api/code-runner/execute
{
  "scriptId": "basic-stats"
}

// 响应
{
  "code": 0,
  "data": {
    "success": true,
    "outputs": [
      { "type": "text", "content": "=== 快速数据摘要 ===\n..." }
    ],
    "executionTime": 856
  }
}
```

### 场景 2：仅自定义参数

```json
// 请求
POST /api/code-runner/execute
{
  "scriptId": "linear-regression",
  "variables": {
    "sample_size": 50,
    "noise_level": 0.2
  }
}
```

### 场景 3：仅上传数据

```json
// 请求
POST /api/code-runner/execute
{
  "scriptId": "basic-stats",
  "fileData": "value\n12.5\n15.3\n18.7\n22.1\n25.8",
  "isRawInput": true
}
```

### 场景 4：同时使用自定义参数和上传数据

```json
// 请求
POST /api/code-runner/execute
{
  "scriptId": "linear-regression",
  "variables": {
    "sample_size": 150,
    "noise_level": 0.2
  },
  "fileData": "x,y\n1,2.3\n2,4.1\n3,6.2\n4,8.5\n5,10.1",
  "isRawInput": true
}
```

---

## 注意事项

1. **图片编码**: 图片数据使用纯 Base64 编码，前端需根据 `format` 字段添加 `data:image/{format};base64,` 前缀
2. **执行超时**: R 脚本执行超时时间为 30 秒
3. **文件大小**: 建议 `fileData` 大小不超过 5MB
4. **并发控制**: 后端限制同时执行的 R 进程数量为 CPU 核心数
5. **变量类型转换**: 后端会自动将字符串形式的数字转换为 R 的数值类型
6. **Token 使用**: 登录成功后返回的 token 需要在后续请求的 `Authorization` 头中携带
7. **验证码有效期**: 验证码有效期为 5 分钟，且为一次性使用

---

## 错误码

| code | 描述 |
|------|------|
| 0 | 成功 |
| 400 | 参数校验失败 |
| 401 | 未登录或登录已过期 |
| 403 | 无权限访问 |
| 500 | 服务器内部错误 |
| 1001 | 参数错误 |
| 1002 | 脚本不存在 |
| 1003 | 验证码错误或已过期 |
| 1004 | 用户名已存在 |
| 5000 | 系统错误 |

---

## 权限说明

### 公开接口（无需登录）

- `GET /api/captcha` - 获取验证码
- `POST /api/user/login` - 用户登录
- `GET /api/code-runner/scripts` - 获取脚本列表
- `GET /api/code-runner/chapters` - 获取章节列表
- `GET /api/code-runner/scripts/{id}` - 获取脚本详情
- `POST /api/code-runner/execute` - 执行脚本

### 需要登录的接口

- `POST /api/user/logout` - 用户登出

### 仅限管理员（ADMIN）的接口

- `POST /api/user/register` - 注册新用户
- `POST /api/user/batch-import` - 批量导入用户
- `PUT /api/user/{id}/reset-password` - 重置用户密码
- `GET /api/user/list` - 获取用户列表
- `DELETE /api/user/{id}` - 删除用户
- `GET /api/user/{userId}/logs` - 获取用户日志
- `GET /api/user/logs` - 获取所有日志
- `POST /api/code-runner/admin/scripts` - 创建脚本
- `PUT /api/code-runner/admin/scripts/{id}` - 更新脚本
- `DELETE /api/code-runner/admin/scripts/{id}` - 删除脚本
