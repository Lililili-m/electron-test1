# Electron Test 1

基于 Electron React Boilerplate 构建的**解耦架构**桌面应用容器。

## 🏗️ 架构特点

- **完全解耦**：Electron 容器与 React 内容分离
- **独立开发**：React 项目可独立运行和测试
- **微前端**：通过 `loadURL` 加载独立的 React 服务
- **灵活部署**：支持本地文件和远程 URL

## 🛠️ 技术栈

- **Electron** - 跨平台桌面应用容器
- **React** - 独立的 UI 项目（来自 react-test1）
- **TypeScript** - 类型安全
- **pnpm** - 高效包管理

## 📁 项目结构

```
workspace/
├── electorn-test1/     # 👈 当前项目（Electron 容器）
│   └── src/main/       # 主进程容器逻辑
└── react-test1/       # React 内容项目
    └── src/            # 业务逻辑和 UI
```

## 开发环境

确保已安装以下环境：

- Node.js >= 14.x
- pnpm >= 7.x

## 安装与运行

### 安装依赖

```bash
pnpm install
```

### 🚀 启动方式（解耦架构）

#### 方式一：同时启动（推荐）
```bash
# 同时启动 React 服务和 Electron 容器
pnpm run start:with-react
```

#### 方式二：分别启动
```bash
# 终端 1：启动 React 项目
cd ../react-test1
PORT=5234 npm start

# 终端 2：启动 Electron 容器
pnpm run start:electron-only
```

### 生产环境

```bash
pnpm run build     # 构建 Electron 容器
pnpm run package   # 打包桌面应用
```

## 📜 可用脚本

- `pnpm run start:with-react` - 🔥 同时启动 React + Electron
- `pnpm run start:electron-only` - 启动 Electron 容器
- `pnpm run build` - 构建生产版本
- `pnpm run package` - 打包桌面应用
- `pnpm run lint` - 代码检查

## ✨ 架构优势

- 🔄 **完全解耦**：两个项目独立开发
- 🔥 **热重载**：React 项目保持原生热重载
- 🧪 **独立测试**：React 项目可以独立运行测试
- 🌐 **灵活部署**：支持本地和远程 URL
- 📦 **微前端**：可以加载多个不同的 React 项目
- ⚡ **快速开发**：无需重启 Electron 即可更新 UI

## 🔧 架构说明

### Electron 容器（当前项目）
- 位置：`src/main/main.ts`
- 职责：窗口管理、系统 API、容器逻辑
- 加载方式：`loadURL('http://localhost:5234')`

### React 内容（react-test1）
- 位置：`../react-test1/src/`
- 职责：业务逻辑、UI 组件、用户交互
- 运行方式：独立的开发服务器

### 通信机制
- 使用 Electron IPC 进行进程间通信
- preload 脚本暴露安全的 API 接口

## 许可证

MIT License
