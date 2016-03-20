'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var ipc = require('ipc');
var Tray = require('tray');
var Menu = require('menu');
var appIcon = null;
var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', function () {
    createWindow();

    appIcon = new Tray(__dirname + '/img/icon.png');
    var array = [];
    var item = {};

    item["label"] = "asynchronous";
    item["click"] = function () {
        // 非同期でレンダープロセスへメッセージを送信する
        mainWindow.webContents.send('main-process-message', 'main process send message.');
    };
    array.push(item);
    var contextMenu = Menu.buildFromTemplate(array);
    appIcon.setContextMenu(contextMenu);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 非同期でレンダープロセスからのメッセージを受信し、メッセージを返信する
ipc.on('asynchronous-message', function (event, arg) {
    console.log("asynchronous-message arg : " + arg);
    event.sender.send('asynchronous-reply', 'asynchronous-message main process.');
});

// 同期でレンダープロセスからのメッセージを受信し、メッセージを返信する
ipc.on('synchronous-message', function (event, arg) {
    console.log("synchronous-message arg : " + arg);
    event.returnValue = 'synchronous-message main process.';
});

