const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));

function createWindow() {
    const win = new BrowserWindow({
        width: 680,
        height: 650,
        webPreferences: {
            webSecurity: false, // Allows local file navigation
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

ipcMain.handle('gemini-chat', async (event, message) => {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${AIzaSyByZqiSFDD2YfqMtCQua2vaH8wNJKscOoU}' + process.env.GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Error:', error);
        return 'Sorry, I had trouble connecting. Please try again!';
    }
});

app.whenReady().then(createWindow)

// Handle app events for better cross-platform support
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
