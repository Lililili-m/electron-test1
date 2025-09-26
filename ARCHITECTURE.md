# Electron + React 解耦架构

本项目采用了 Electron 与 React 内容完全解耦的架构设计。

## 架构概述

```
┌─────────────────────┐    loadURL    ┌─────────────────────┐
│   Electron 容器     │ ────────────► │   React 独立服务    │
│                     │               │                     │
│ - 主进程管理        │               │ - 业务逻辑          │
│ - 窗口控制          │               │ - UI 组件           │
│ - 系统级 API        │               │ - 独立开发/测试     │
│ - IPC 通信          │               │ - 热重载            │
└─────────────────────┘               └─────────────────────┘
```

## 项目结构

```
workspace/
├── electorn-test1/        # Electron 容器项目
│   ├── src/main/          # 主进程（核心容器逻辑）
│   ├── src/preload/       # 预加载脚本
│   └── package.json       # Electron 依赖
│
└── react-test1/          # React 内容项目
    ├── src/               # React 组件和业务逻辑
    ├── public/            # 静态资源
    └── package.json       # React 依赖
```

## 工作原理

### 开发环境
1. **React 项目**运行在 `http://localhost:5234`
2. **Electron 主进程**通过 `loadURL()` 加载 React 开发服务器
3. 两个项目完全独立，可以单独开发和调试

### 生产环境
1. React 项目构建为静态文件
2. Electron 加载本地构建的文件
3. 打包为单个桌面应用

## 启动方式

### 方式一：同时启动（推荐）
```bash
# 在 electorn-test1 目录下
pnpm run start:with-react
```
这会同时启动：
- React 开发服务器（端口 5234）
- Electron 应用容器

### 方式二：分别启动
```bash
# 终端 1：启动 React 项目
cd ../react-test1
PORT=5234 npm start

# 终端 2：启动 Electron 容器
cd electorn-test1
pnpm run start:electron-only
```

## 架构优势

### ✅ 完全解耦
- React 项目可以独立开发、测试、部署
- Electron 只作为容器，不包含业务逻辑
- 两个项目的依赖完全分离

### ✅ 开发体验
- React 项目保持热重载
- 可以独立调试 React 应用
- 支持 React 开发工具

### ✅ 微前端架构
- 支持多个 React 项目
- 可以动态切换加载的 URL
- 便于团队协作开发

### ✅ 灵活部署
- React 项目可以部署为 Web 应用
- Electron 容器可以加载远程 URL
- 支持渐进式桌面化

## 配置选项

### 环境变量
- `REACT_PORT`: React 开发服务器端口（默认 5234）
- `NODE_ENV`: 运行环境（development/production）

### 主进程配置
在 `src/main/main.ts` 中可以配置：
- 窗口大小和属性
- 加载的 URL 地址
- 安全策略

## 常见问题

### Q: React 项目无法访问 Electron API？
A: 通过 preload 脚本暴露安全的 API 接口，避免直接访问。

### Q: 如何在生产环境中使用？
A: 构建 React 项目为静态文件，修改 `getLoadUrl()` 函数加载本地文件。

### Q: 可以加载远程 URL 吗？
A: 可以，修改 `getLoadUrl()` 函数返回远程 URL 即可。

## 安全考虑

- 禁用了 `webSecurity` 以允许跨域访问
- 使用 preload 脚本限制 API 访问
- 生产环境建议重新启用安全策略 