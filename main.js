const { app, BrowserWindow } = require('electron')
const path = require('path');


function createWindow() {
    const win = new BrowserWindow({
        width: 680,
        height: 650,
        webPreferences: {
            webSecurity: true, // Allows local file navigation
            nodeIntegration: false,
            contextIsolation: true,
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(createWindow)


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
