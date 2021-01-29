const { app, BrowserWindow,screen,globalShortcut } = require('electron')
var fs = require("fs")
global.MyGlobalObject = {
   toTalk: '0'
}

function createWindow () {

  const win = new BrowserWindow({
    width: 400,//400
    height: 700,
    frame: false,
    transparent:true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webviewTag: true,
      sandbox:false,
      experimentalFeatures:true,
      plugins:true,
      alwaysOnTop:false
    }
  })

  win.loadFile('index.html')
  //win.loadURL('http://localhost:3000/')
  //win.webContents.openDevTools()
  win.setResizable(false)
  win.removeMenu()
  globalShortcut.register('Super+Y', () => {
    win.show();
    global.MyGlobalObject = {
       toTalk: '1'
    }
  })
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
