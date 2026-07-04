const { app, BrowserWindow, globalShortcut } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    frame: true, // Native window frame restored
    backgroundColor: '#0c0c0e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Default menu is restored by not calling setMenu(null)

  // Point to Next.js in dev, or static files in prod
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'out/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Default close behavior for standard windows
  mainWindow.on('close', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // The Magic Trigger (optional, but keeping it as a feature)
  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
