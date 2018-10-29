if (require('electron-squirrel-startup')) return;

const setupEvents = require('../installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let loginPageWindow;
let homePageWindow;

app.on('ready', function () {
    homePageWindow = new BrowserWindow({
        minimizable: true,
        maximizable: true,
        //frame: false,
        closable: true,
        //resizable: false,
    });
    homePageWindow.maximize();
    homePageWindow.setMenu(null);


    loginPageWindow = new BrowserWindow({
        width: 450,
        height: 320,
        minimizable: false,
        parent: homePageWindow,
        maximizable: false,
        closable: true,
        frame: false,
        resizable: false
    });
    loginPageWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/loginPage.html'),
        protocol: 'file:',
        slashes: true,
    }));

    //loginPageWindow.webContents.openDevTools();
    loginPageWindow.setMenu(null);

    // delete line below
    //createHomePageWindow();

    homePageWindow.on('closed', function () {
        loginPageWindow = null;
        app.quit();
    });
});

ipcMain.on('SUCCESSFUL', function (e) {
    createHomePageWindow();
    loginPageWindow.close();
    loginPageWindow = null;
});

function createHomePageWindow() {
    homePageWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/homePage.html'),
        protocol: 'file:',
        slashes: true
    }));
    //const homePageMenu = Menu.buildFromTemplate(homePageMenuTemplate);
    //Menu.setApplicationMenu(homePageMenu);
    //homePageWindow.webContents.openDevTools();
}