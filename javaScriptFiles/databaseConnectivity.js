var dbValues = null;
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'darshanjain@123',
    database: 'linenlaurasinglepageapplication',
    insecureAuth: true
});
connection.connect();

// const remote = require("electron").remote;
// document.addEventListener("keydown", event => {

//     switch (event.key) {
//         case "Escape":
//             if (remote.getCurrentWindow()) {
//                 remote.getCurrentWindow().close();
//             }
//             break;
//     }
// });

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function takeBackup() {
    var mysqldump = require('mysqldump');
    var datetime = new Date();
    var folderName = (new Date(Date.now()).getDate() + "." + (new Date(Date.now()).getMonth() + 1) + "." + new Date(Date.now()).getFullYear()).toString();
    var backupDate = folderName;
    var backupTime = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds();
    var fs = require('fs');
    var dir = 'C:\\appbackup\\' + folderName;
    var fileName = folderName + "@" + new Date(Date.now()).getHours() + "." + new Date(Date.now()).getMinutes() + "." + new Date(Date.now()).getSeconds();;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'darshanjain@123',
            database: 'linenlaurasinglepageapplication'
        },
        dumpToFile: 'C:\\appbackup\\' + folderName + '/' + fileName + 'backup.sql',
    })

    // update backup datetime in the database
    connection.query("UPDATE seriesnumber SET seriesValue = (case when seriesName = 'backupDate' then '" + backupDate + "' when seriesName = 'backupTime' then '" + backupTime + "' end) WHERE seriesName in ('backupDate', 'backupTime', 'admin');",
        function (err, result) {
            if (err) throw err;
        });
    alert("We have successfully taken backup", "Kalash-IT Services");
    loadLastBackupDetails();
}

function loadLastBackupDetails() {
    connection.query("SELECT seriesValue from seriesnumber WHERE seriesName = 'backupDate' OR seriesName = 'backupTime';", function (error, results, fields) {
        if (error) throw error;
        document.getElementById("backupTimeLabel").innerHTML = results[0].seriesValue + " @ " + results[1].seriesValue;

    });
}

function promptUserForLogout() {
    if (confirm("Are you sure you want to Close Application ? ", "Kalash-IT Services")) {
        window.close();
    }
}