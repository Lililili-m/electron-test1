/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

/**
 * 获取要加载的URL
 * 开发环境：加载 react-test1 项目的开发服务器
 * 生产环境：加载本地构建的文件
 */
const getLoadUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境');
    return `http://localhost:5234`;
  }
  
  // 生产环境：加载本地构建的文件
  return `file://${path.resolve(__dirname, '../renderer/', 'index.html')}`;
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      // 允许跨域，因为要加载外部服务器
      webSecurity: false,
      // 允许访问本地资源
      allowRunningInsecureContent: true,
    },
  });

  // 加载 React 项目 URL
  const loadUrl = getLoadUrl();
  console.log(`🚀 正在加载: ${loadUrl}`);
  
  try {
    await mainWindow.loadURL(loadUrl);
    console.log('✅ 页面加载成功');
  } catch (error) {
    console.error('❌ 页面加载失败:', error);
    // 加载失败时，跳转到错误页面路由
    console.log('🔄 正在加载错误页面...');
    try {
      // 尝试加载本地构建的错误页面
      await mainWindow.loadURL(resolveHtmlPath('index.html'));
      console.log('✅ 错误页面加载成功');
    } catch (fallbackError) {
      console.error('❌ 错误页面也加载失败', fallbackError);
      // 最后的降级方案：使用内联HTML
      await mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(getInnerErrorPage())}`);
    }
  }
  
  // 确保窗口显示（即使加载失败也显示）
  mainWindow.show();

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const getInnerErrorPage = () => {
  const errorHtml = `
        <html>
          <head>
            <meta charset="utf-8" />
            <title>加载失败</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                text-align: center; 
                padding: 50px;
                background: #f5f5f5;
              }
              .error-container {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 500px;
                margin: 0 auto;
              }
              h1 { color: #e74c3c; }
              p { color: #666; margin: 20px 0; }
              .command { 
                background: #2c3e50; 
                color: #ecf0f1; 
                padding: 10px; 
                border-radius: 4px; 
                font-family: monospace; 
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="error-container">
              <h1>⚠️ 严重错误</h1>
              <p>React 项目和 Electron 渲染进程都无法加载</p>
              <p><strong>解决方案：</strong></p>
              <p>1. 确保已构建渲染进程：</p>
              <div class="command">npm run build:renderer</div>
              <p>2. 或启动开发模式：</p>
              <div class="command">cd ../react-test1 && PORT=5234 npm start</div>
            </div>
          </body>
        </html>
      `;
  return errorHtml;
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
