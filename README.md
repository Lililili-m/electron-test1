# Electron Test 1

基于 Electron React Boilerplate 构建的桌面应用项目。

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **React** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Webpack** - 模块打包工具
- **Sass** - CSS 预处理器

## 项目结构

```
src/
├── main/           # 主进程代码
├── renderer/       # 渲染进程代码 (React)
└── __tests__/      # 测试文件
```

## 开发环境

确保已安装以下环境：

- Node.js >= 14.x
- npm >= 7.x

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 打包应用

```bash
npm run package
```

## 可用脚本

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run package` - 打包应用程序
- `npm run lint` - 运行代码检查
- `npm run test` - 运行测试

## 特性

- 🔥 热重载开发环境
- 📦 自动打包和分发
- 🔧 内置开发工具
- 🎨 Sass 样式支持
- 📝 TypeScript 类型检查
- ⚡ 快速构建和刷新

## 开发指南

### 主进程开发

主进程代码位于 `src/main/` 目录，负责：
- 创建和管理窗口
- 处理系统级操作
- 进程间通信 (IPC)

### 渲染进程开发

渲染进程代码位于 `src/renderer/` 目录，使用 React 构建用户界面。

### 进程间通信

使用 Electron 的 IPC 机制在主进程和渲染进程之间通信。

## 许可证

MIT License
