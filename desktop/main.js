/**
 * ClinicPlan (کلینیک پلن) — Electron desktop shell for Windows 11.
 * Loads the static Vite build (dist) from ./app as an offline desktop app.
 */
const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

const APP_HTML = path.join(__dirname, 'app', 'index.html');

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    title: 'کلینیک پلن | Clinic Plan',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  win.once('ready-to-show', () => win.show());

  // External links (GitHub releases, Telegram, …) open in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadFile(APP_HTML);
}

// Keep the app clean: no default menu bar
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
