// electron-main/index.ts
const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.ts'),
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, './index.html'));
  } else {
    // Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://127.0.0.1:5173/`;
    win.loadURL(url);

    // 添加 devtools
    win.webContents.openDevTools()
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});