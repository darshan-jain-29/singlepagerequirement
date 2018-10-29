const electron = require('electron');
const { ipcRenderer } = electron;
var userN = null;
var pass = null;

function checkLoginDetails() {
    if (validatePage() == 0)
        return;
    userN = document.getElementById("usrname").value;
    pass = document.getElementById("psword").value;
    connection.query("SELECT * from logincredentials WHERE username = '" + userN + "' AND password ='" + pass + "';"
        , function (error, results, fields) {
            if (error) throw error;
            checkIfUserExist(results);
            //console.log(results);
        });
}

function checkIfUserExist(data) {
    var i = 0;
    for (i = 0; i < data.length; i++) {
        if (data[i].username == userN && data[i].password == pass) {
            //console.log("Matched");
            break;
        }
    }
    if (i < data.length) {
        alert("Login Successful!", "Kalash-IT Services");
        ipcRenderer.send('SUCCESSFUL');
    }
    else {
        //console.log("Nahi hua match");
        document.getElementById("errorMessage").style.display = 'block';
    }
}

function resetErrorMessage() {
    document.getElementById("usrname").value = null;
    document.getElementById("psword").value = null;
    document.getElementById("errorMessage").style.display = 'none';
}

function validatePage() {
    if (document.getElementById("usrname").value.trim() == '') {
        document.getElementById("usrname").style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById("usrname").style.backgroundColor = "#white";

    if (document.getElementById("psword").value.trim() == '') {
        document.getElementById("psword").style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById("psword").style.backgroundColor = "#white";
    return 1;
}