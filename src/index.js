// Modules to control application life and create native browser window
const { app, BrowserWindow, webContents } = require('electron');
const path = require('path')
const { Client } = require('discord-rpc');
//const { blockWindowAds } = require('electron-ad-blocker');

const script = require(path.join(__dirname, 'js/youtube'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Discord RPC
const clientId = "569595161928269844";
const discord = new Client({ transport: 'ipc' })

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            preload: path.join(__dirname, 'js/youtube.js')
        },
        icon: path.join(__dirname, '../assets/img/icon.png')
    });

    //blockWindowAds(mainWindow, {})

    // load the youtube music webpage.
    mainWindow.loadURL('https://music.youtube.com/');

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // discord login
    discord.login({ clientId }).catch(console.error);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// Called when the discord rpc is ready (-> client connected)
// Then updates the rich presence and schedule the update every 15 seconds.
// (The documentation says that the limit for updating the Rich Presence is one update every 15 seconds.)
discord.on('ready', () => {
    setDiscordActivity();
    setInterval(setDiscordActivity, 15e3);
});

// Request site informations & submit RPC update.
async function setDiscordActivity() {
    if (!discord || !mainWindow) {
        return;
    }

    var rpcData = await mainWindow.webContents.executeJavaScript(`(${script})()`);
    
    // Check if state is empty if passed and cancel update. Usally happens while ads are playing
    if(rpcData.state & rpcData.state == "") return;

    discord.setActivity(rpcData);
}