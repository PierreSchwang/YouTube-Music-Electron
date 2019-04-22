// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const { Client } = require('discord-rpc');

const Locale = require('./locale');

//const { blockWindowAds } = require('electron-ad-blocker');

const script = require(path.join(__dirname, 'js/youtube'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Discord RPC
const clientId = "569595161928269844";
const discord = new Client({ transport: 'ipc' })

// Messaging over ipc
let thumbBarMesseger;

function createWindow() {
    // Wait until all locales and translations are loaded and THEN create the browser window.
    global.Locale = new Locale();

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
    //mainWindow.setMenu(null);

    mainWindow.setThumbarButtons([
        {
            tooltip: 'Zurück',
            icon: path.join(__dirname, '../assets/img/icons/previous.png'),
            click: () => {
                if (!thumbBarMesseger) return;
                thumbBarMesseger.send("ToolbarClick", "back");
            }
        },
        {
            tooltip: 'Pausieren',
            icon: path.join(__dirname, '../assets/img/icons/pause.png'),
            click: () => {
                if (!thumbBarMesseger) return;
                thumbBarMesseger.send("ToolbarClick", "pauseplay");
            }
        },
        {
            tooltip: 'Nächste',
            icon: path.join(__dirname, '../assets/img/icons/next.png'),
            click: () => {
                if (!thumbBarMesseger) return;
                thumbBarMesseger.send("ToolbarClick", "next");
            }
        }
    ]);
    //blockWindowAds(mainWindow, {})

    // load the youtube music webpage.
    mainWindow.loadURL('https://music.youtube.com/');

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.webContents.executeJavaScript(`(${script})()`);

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

ipcMain.on("YoutubeData", (event, args) => {
    if (args.state & args.state == "") return;
    discord.setActivity(args);
})

ipcMain.on("Toolbar", (event, args) => {
    this.thumbBarMesseger = event.sender;
})