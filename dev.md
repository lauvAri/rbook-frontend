## 组织架构

采用以特性为中心的组织架构，项目结构解析：

```
src/
|-- assets/              # 静态资源 (图片, 字体, SVG)
|-- components/          # 【通用】UI 组件库 (按钮, 输入框, 模态框) - 不包含业务逻辑
|   |-- Button/
|   |   |-- Button.tsx
|   |   |-- Button.test.tsx
|   |   |-- Button.module.css
|   |   `-- index.ts
|-- config/              # 全局配置 (环境变量, 常量)
|-- features/            # 【核心】业务功能模块 (见下文详细解释)
|   |-- auth/            # 例如：认证模块
|   |-- product/         # 例如：商品模块
|   `-- user/            # 例如：用户模块
|-- hooks/               # 【通用】自定义 Hooks (useScroll, useWindowSize)
|-- layouts/             # 布局组件 (SidebarLayout, AuthLayout)
|-- lib/                 # 第三方库的二次封装 (axios 实例, react-query 配置)
|-- providers/           # 应用层级的 Provider (Theme, AuthProvider)
|-- routes/              # 路由定义
|-- stores/              # 全局状态管理 (Redux, Zustand) - 仅存放跨 feature 的状态
|-- types/               # 全局 TypeScript 类型定义
|-- utils/               # 【通用】工具函数 (日期格式化, 校验)
|-- App.tsx
`-- main.tsx
```

## 三方库使用情况

- axios：在 `src/lib/axios.ts` 进行了实例化和导出，配置了axiosInstance
- @tanstack/react-query：在 `src/lib/react-query.ts` 配置了tanstack，用于请求状态的管理，在 `src/main.tsx` 提供provider

## 需求

### UI

1. 整体设计以移动端为主导，同时适应Web端
2. 不要使用蓝紫渐变色，使用纯色，对于一些小组件，可以适当使用渐变色
3. #0984e3 作为主题色 #fdcb6e 作为accent颜色
4. 在 `src/components` 中封装项目公共组件，如Card，List等

### 特性1：代码执行器

1. 这个特性的代码统一放置在 `src/features/code-runner`，这个特性是用于执行R语言代码，并返回结果到前端
2. 需要支持三种运行模式
    1. 直接运行
    2. 对于简单的变量，支持替换变量运行（在Form表单中明确可以替换的变量）
    3. 对于输入文件，支持上传csv文件和直接在输入框输入数据
    需要注意的是，2和3是可以结合起来的
3. 代码执行结果包含文字和图片，都要进行展示
4. 前端不展示R语言代码，R语言代码在后端维护

**注意事项**：现在后端API结构还不确定，所以前端调用API的时候，进行模拟