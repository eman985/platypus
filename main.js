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
            webSecurity: true, // Allows local file navigation
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}



ipcMain.handle('gemini-chat', async (event, message) => {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.AIzaSyA5m9VRjD6CpULbWf4lHKmpT1nCaqEi6OM}', {
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

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response (Not OK):', errorData);
            throw new Error('API request failed with status ${response.status}');
        }

        const data = await response.json();
        console.log('API Response Data:', JSON.stringify(data, null, 2)); // Keep this for debugging!

        // THIS IS THE FIX
        // Check if candidates array exists and has content
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            // Handle cases where there are no candidates (e.g., safety filters, error)
            console.error('API Error: No candidates returned.', data);
            return 'I received a response, but it was empty. This might be due to safety settings or an API error.';
        }

    } catch (error) {
        console.error('General Error in ipcMain.handle:', error);
        return 'Sorry, I had trouble connecting. Please check the console for details.';
    }
})

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
