import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('根元素未找到！请检查 HTML 模板');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Electron IPC 通信 (可选)
// 只在 Electron 环境中执行，避免在独立 React 项目中报错
if (window.electron?.ipcRenderer) {
  // 监听来自主进程的消息
  window.electron.ipcRenderer.once('ipc-example', (arg) => {
    // eslint-disable-next-line no-console
    console.log('收到主进程消息:', arg);
  });

  // 向主进程发送消息
  window.electron.ipcRenderer.sendMessage('ipc-example', [
    '来自渲染进程的ping',
  ]);

  // eslint-disable-next-line no-console
  console.log('🔗 Electron IPC 通信已初始化');
} else {
  // eslint-disable-next-line no-console
  console.log('⚠️  非 Electron 环境，IPC 功能不可用');
}
