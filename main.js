const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

let mainWindow;

app.on('ready', () => {
  isDev && require('devtron').install();

  mainWindow = new BrowserWindow({
    width : 1024,
    height : 768,
    webPreferences : {
      nodeIntegration : true,
    }
  })

  isDev ? mainWindow.loadURL('http://localhost:3000')
    : mainWindow.loadFile('index.html')
})