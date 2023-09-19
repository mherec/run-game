const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const { fastConfig } = require('./modules/fastConfig.js');
const net = require('net');
const path = require('path');
const url = require('url');
const expressModule = require('express');
const appServer = expressModule();
const PORT = 3000;

appServer.use(expressModule.static('runApp'));

let mainWindow;

const contextMenu = new Menu();
contextMenu.append(new MenuItem({ label: 'Opcja 1', click() { console.log('Opcja 1 kliknięta'); } }));
contextMenu.append(new MenuItem({ type: 'separator' }));
contextMenu.append(new MenuItem({ label: 'Opcja 2', click() { console.log('Opcja 2 kliknięta'); } }));


function createWindow() {
  app.on('server-ready', () => {
    setTimeout(() => {
      mainWindow.loadURL(`http://localhost:${PORT}`);
    }, 100);
    console.log('server-ready-0');
  });

  mainWindow = new BrowserWindow({
    width: fastConfig.width,
    height: fastConfig.height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  function showAlertAndQuit() {
    const options = {
      type: 'error',
      buttons: ['OK'],
      title: 'Application error',
      message: 'Application error: server not running.'
    };

    dialog.showMessageBox(options).then(response => {
      if (response.response === 0) {
        app.quit();
      }
    });
  }

  mainWindow.loadFile('modules/loader.html');

  mainWindow.setMenu(null);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  appServer.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}...`);
    app.emit('server-ready'); // Emituj zdarzenie po uruchomieniu serwera
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});


