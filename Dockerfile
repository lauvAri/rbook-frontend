# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 构建参数（可在构建时覆盖）
ARG VITE_API_URL=/api

# 设置为环境变量供 Vite 使用
ENV VITE_API_URL=${VITE_API_URL}

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM nginx:alpine AS production

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动脚本：替换 API 地址后启动 nginx
CMD ["/bin/sh", "-c", "sed -i \"s|API_BACKEND|${API_BACKEND:-host.docker.internal:8080}|g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
