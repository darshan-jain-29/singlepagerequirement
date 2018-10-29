const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const url = require('url');
const path = require('path');
var myModule = require('./homePage');
var d = myModule.homePageGlobalObject;

module.exports = {
    openOpeningStockEntryPage: function () {
        let openingStockEntry = new BrowserWindow({
            width: 1250,
            height: 625,
            minimizable: false,
            parent: d,
            maximizable: false,
            closable: true,
            frame: false,
            resizable: false,
        });
        openingStockEntry.loadURL(url.format({
            pathname: path.join(__dirname, '../webFiles/openOpeningStockEntryPage.html'),
            protocol: 'file:',
            slashes: true
        }));
        openingStockEntry.setMenu(null);
        //openingStockEntry.webContents.openDevTools();
    },

    openStockOrderManagementForm: function () {
        let openStockOrderManagement = new BrowserWindow({
            width: 1250,
            height: 625,
            minimizable: false,
            maximizable: false,
            parent: d,
            closable: true,
            frame: false,
            resizable: false,
        });
        openStockOrderManagement.loadURL(url.format({
            pathname: path.join(__dirname, '../webFiles/openStockOrderManagementPage.html'),
            protocol: 'file:',
            slashes: true
        }));
        openStockOrderManagement.setMenu(null);
        openStockOrderManagement.webContents.openDevTools();
    },

    openEditStockForm: function () {
        let openEditStockPage = new BrowserWindow({
            width: 1250,
            height: 625,
            minimizable: false,
            maximizable: false,
            parent: d,
            closable: true,
            frame: false,
            resizable: false,
        });
        openEditStockPage.loadURL(url.format({
            pathname: path.join(__dirname, '../webFiles/editStockPage.html'),
            protocol: 'file:',
            slashes: true
        }));
        openEditStockPage.setMenu(null);
        openEditStockPage.webContents.openDevTools();
    },

    openBackupDataPage: function () {
        let openBackupData = new BrowserWindow({
            width: 300,
            height: 200,
            minimizable: false,
            parent: d,
            maximizable: false,
            closable: true,
            frame: false,
            resizable: false,
        });
        openBackupData.loadURL(url.format({
            pathname: path.join(__dirname, '../webFiles/backupDataPage.html'),
            protocol: 'file:',
            slashes: true
        }));
        openBackupData.setMenu(null);
        //openBackupData.webContents.openDevTools();
    },

    createUserPage: function () {
        let createUser = new BrowserWindow({
            width: 1250,
            height: 625,
            minimizable: false,
            parent: d,
            maximizable: false,
            closable: true,
            frame: false,
            resizable: false,
        });
        createUser.loadURL(url.format({
            pathname: path.join(__dirname, '../webFiles/createUser.html'),
            protocol: 'file:',
            slashes: true
        }));
        createUser.setMenu(null);
        //createUser.webContents.openDevTools();
    },

    speechToText: function () {
        let speechToT = new BrowserWindow({
            width: 1100,
            height: 500,
            minimizable: false,
            parent: d,
            maximizable: false,
            closable: true,
            //frame: false,
            resizable: false,
        });
        speechToT.loadURL(url.format({
            pathname: path.join(__dirname, '../webFiles/speechToTextPage.html'),
            protocol: 'file:',
            slashes: true
        }));
        //speechToT.setMenu(null);
        speechToT.webContents.openDevTools();
    }
}