const { app, BrowserWindow, Menu, Tray, nativeImage, session } = require('electron');
const { spawn } = require('node:child_process');
const { mkdirSync } = require('node:fs');
const path = require('node:path');

let mainWindow;
let tray;
let backendProcess;
let isQuitting = false;

app.setName('J.A.R.V.I.S');
app.setPath('userData', path.join(app.getPath('appData'), 'jarvis-assistant'));
mkdirSync(app.getPath('userData'), { recursive: true });

const showWindow = () => {
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
};

const createTray = () => {
  const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#071322" stroke="#00f0ff" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="#00f0ff"/><path d="M16 1v6M16 25v6M1 16h6M25 16h6" stroke="#8bf5ff" stroke-width="2"/></svg>';
  const icon = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`);
  tray = new Tray(icon);
  tray.setToolTip('J.A.R.V.I.S');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show J.A.R.V.I.S', click: showWindow },
    { label: 'Microphone is off while hidden', enabled: false },
    { type: 'separator' },
    { label: 'Quit J.A.R.V.I.S', click: () => app.quit() },
  ]));
  tray.on('click', showWindow);
};

const startPackagedBackend = () => {
  if (!app.isPackaged) return;
  const serverEntry = path.join(process.resourcesPath, 'server', 'index.js');
  backendProcess = spawn(process.execPath, [serverEntry], {
    cwd: path.dirname(serverEntry),
    windowsHide: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      JARVIS_ENV_PATH: path.join(app.getPath('userData'), '.env'),
      PORT: process.env.PORT || '3001',
    },
  });
  backendProcess.on('error', (error) => console.error('JARVIS backend failed to start:', error));
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 680,
    show: false,
    backgroundColor: '#050914',
    title: 'J.A.R.V.I.S',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.once('ready-to-show', showWindow);
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5175';
  if (app.isPackaged) {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    await mainWindow.loadURL(devUrl);
  }
};

app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowMedia = permission === 'media'
      && mainWindow
      && webContents === mainWindow.webContents
      && mainWindow.isVisible()
      && mainWindow.isFocused();
    callback(Boolean(allowMedia));
  });
  startPackagedBackend();
  createTray();
  await createWindow();
  app.on('activate', showWindow);
});

app.on('before-quit', () => {
  isQuitting = true;
  if (backendProcess && !backendProcess.killed) backendProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin' && isQuitting) app.quit();
});