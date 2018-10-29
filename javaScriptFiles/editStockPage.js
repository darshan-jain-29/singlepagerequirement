var lastEditedRow = 1;
var dbOpeningStockValues = "";

function checkCredentialsOfSuperUser() {
    var dbValues = null;
    connection.query('SELECT * from logincredentials', function (error, results, fields) {
        if (error) throw error;
        furtherCheck(results);
    });
}

function furtherCheck(dbValues) {
    if (document.getElementById("username").value.trim() != null && document.getElementById("password").value.trim() != null) {
        const usName = document.getElementById("username").value;
        const psWord = document.getElementById("password").value;
        var i = 0;
        console.log(usName, psWord, dbValues);
        for (i = 0; i < dbValues.length; i++) {
            if (usName == dbValues[i].username && psWord == dbValues[i].password && dbValues[i].caneditmaster == "YES") {
                //console.log("Matched");
                break;
            }
        }
        if (i < dbValues.length) {
            document.getElementById("errorMessage").hidden = true;
            document.getElementById("superUserDetailsForm").hidden = true;
            document.getElementById("searchBoxUl").hidden = false;
            document.getElementById("stockDataDiv").hidden = false;
            loadStock();
        }
        else {
            //console.log("Nahi hua match");
            document.getElementById("errorMessage").display.hidden = 'false';
        }
    }
}

function loadStock() {
    connection.query('SELECT * from openingstock ORDER BY designName, designNo, shadeNo', function (error, results, fields) {
        if (error) throw error;
        dbOpeningStockValues = results;
        loadValuesInTable(dbOpeningStockValues);
    });
}

function loadValuesInTable(dbOpeningStockValues) {
    var t = "";
    var tableInstance = document.getElementById("stockTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < dbOpeningStockValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (dbOpeningStockValues[i] instanceof Array) {
        } else {
            var designNameBox = document.createElement("input");
            designNameBox.setAttribute("id", "designName" + i);
            designNameBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 7em;");
            designNameBox.setAttribute("value", dbOpeningStockValues[i].designName);
            designNameBox.setAttribute("onfocus", "this.oldvalue = this.value");
            designNameBox.setAttribute("onchange", "onDesignNameChange(this); this.oldvalue = this.value");

            var designNoBox = document.createElement("input");
            designNoBox.setAttribute("id", "designNo" + i);
            designNoBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 6em;");
            designNoBox.setAttribute("value", dbOpeningStockValues[i].designNo);
            designNoBox.setAttribute("onfocus", "this.oldvalue = this.value");
            designNoBox.setAttribute("onchange", "onDesignNoChange(this); this.oldvalue = this.value");

            var shadeNoBox = document.createElement("input");
            shadeNoBox.setAttribute("id", "shadeNo" + i);
            shadeNoBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 6em;");
            shadeNoBox.setAttribute("value", dbOpeningStockValues[i].shadeNo);
            shadeNoBox.setAttribute("onfocus", "this.oldvalue = this.value");
            shadeNoBox.setAttribute("onchange", "onShadeNoChange(this); this.oldvalue = this.value");

            var greyInputBox = document.createElement("input");
            greyInputBox.setAttribute("type", "number");
            greyInputBox.setAttribute("id", "inputG" + i);
            greyInputBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 7em;");
            greyInputBox.setAttribute("value", dbOpeningStockValues[i].inGrey);
            greyInputBox.setAttribute("onfocus", "this.oldvalue = this.value");
            greyInputBox.setAttribute("onchange", "onGreyChange(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].inGrey) < 0)
                greyInputBox.setAttribute("style", "background-color: #ff6666;  width: 7em; text-align: center; vertical-align: middle;");

            var dyeingInputBox = document.createElement("input");
            dyeingInputBox.setAttribute("type", "number");
            dyeingInputBox.setAttribute("id", "inputD" + i);
            dyeingInputBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 7em;");
            dyeingInputBox.setAttribute("value", dbOpeningStockValues[i].inDyeing);
            dyeingInputBox.setAttribute("onfocus", "this.oldvalue = this.value");
            dyeingInputBox.setAttribute("onchange", "onDyeingChange(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].inDyeing) < 0)
                dyeingInputBox.setAttribute("style", "background-color: #ff6666;  width: 7em; text-align: center; vertical-align: middle;");

            var qtyBox = document.createElement("input");
            qtyBox.setAttribute("type", "number");
            qtyBox.setAttribute("id", "inputF" + i);
            qtyBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 7em;");
            qtyBox.setAttribute("value", dbOpeningStockValues[i].qty);
            qtyBox.setAttribute("onfocus", "this.oldvalue = this.value");
            qtyBox.setAttribute("onchange", "onFinishChange(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].qty) < 0)
                qtyBox.setAttribute("style", "background-color: #ff6666;  width: 7em; text-align: center; vertical-align: middle;");

            var balanceStockBox = document.createElement("input");
            balanceStockBox.setAttribute("id", "balanceStock" + i);
            balanceStockBox.setAttribute("type", "number");
            balanceStockBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 7em;");
            var balanceStk = (parseFloat(dbOpeningStockValues[i].inGrey) + parseFloat(dbOpeningStockValues[i].inDyeing) + parseFloat(dbOpeningStockValues[i].qty));
            balanceStockBox.setAttribute("value", balanceStk);
            balanceStockBox.setAttribute("readonly", "true");
            if (parseFloat(balanceStk) < 0)
                balanceStockBox.setAttribute("style", "background-color: #ff6666;  width: 7em; text-align: center; vertical-align: middle;");

            var lockingValueBox = document.createElement("input");
            lockingValueBox.setAttribute("id", "lockingValue" + i);
            lockingValueBox.setAttribute("type", "number");
            lockingValueBox.setAttribute("style", "text-align: center; vertical-align: middle;  width: 6em;");
            lockingValueBox.setAttribute("value", dbOpeningStockValues[i].lockingValue);
            lockingValueBox.setAttribute("onfocus", "this.oldvalue = this.value");
            lockingValueBox.setAttribute("onchange", "changeTotalOrderQty(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].lockingValue) < 0)
                lockingValueBox.setAttribute("style", "background-color: #ff6666;  width: 6em; text-align: center; vertical-align: middle;");

            var deleteButtonBox = document.createElement("input");
            deleteButtonBox.setAttribute("id", "deleteButton" + i);
            deleteButtonBox.setAttribute("type", "image");
            deleteButtonBox.setAttribute("title", "Delete");
            deleteButtonBox.setAttribute("src", "../assets/img/deleteld.png");
            deleteButtonBox.setAttribute("class", "imageButton");
            deleteButtonBox.setAttribute("onclick", "deleteRow(this)");

            var currentCell = newRow.insertCell(-1);
            currentCell.appendChild(designNameBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(designNoBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(shadeNoBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(greyInputBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(dyeingInputBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(qtyBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(balanceStockBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(lockingValueBox);

            currentCell = newRow.insertCell(-1);
            currentCell.appendChild(deleteButtonBox);
        }
    }
}

function onDesignNameChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("designName");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select designName from openingstock where designName = '" + val.oldvalue + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.designName = '" + val.value + "' where t1.designName = '" + val.oldvalue + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
            });
    } else {
        document.getElementById("designName" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function onDesignNoChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("designNo");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select designNo from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + val.oldvalue + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.designNo = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + val.oldvalue + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
            });
    } else {
        document.getElementById("designNo" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function onShadeNoChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("shadeNo");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select shadeNo from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + val.oldvalue + "' ) as t2 set t1.shadeNo = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + val.oldvalue + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
            });
    } else {
        document.getElementById("shadeNo" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function onGreyChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("inputG");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select inGrey from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.inGrey = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
                calculateBalanceStock(tempID[1]);
            });
    } else {
        document.getElementById("inputG" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function onDyeingChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("inputD");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select inDyeing from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.inDyeing = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
                calculateBalanceStock(tempID[1]);
            });
    } else {
        document.getElementById("shadeNo" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function onFinishChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("inputF");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select qty from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.qty = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
                calculateBalanceStock(tempID[1]);
            });

    } else {
        document.getElementById("inputG" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function changeTotalOrderQty(val) {
    resetColorOfThePage();
    var tempID = val.id.split("lockingValue");
    if (val.value.trim()) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select lockingValue from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.lockingValue = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
                document.getElementById(val.id).style.backgroundColor = "lightgreen";
            });

    } else {
        document.getElementById("lockingValue" + tempID[1]).value = val.oldvalue;
        document.getElementById(val.id).style.backgroundColor = "red";
    }
    lastEditedRow = parseInt(tempID[1]);
}

function getQueryData(id) {
    var data = [];
    data.push(document.getElementById("designName" + id).value);
    data.push(document.getElementById("designNo" + id).value);
    data.push(document.getElementById("shadeNo" + id).value);
    return data;
}

function calculateBalanceStock(id) {
    document.getElementById("balanceStock" + id).value = (parseFloat(document.getElementById("inputG" + id).value) + parseFloat(document.getElementById("inputD" + id).value) + parseFloat(document.getElementById("inputF" + id).value)).toString();
    document.getElementById("balanceStock" + id).style.backgroundColor = "lightgreen";
    if (parseFloat(document.getElementById("inputF" + id).value) < 0) {
        document.getElementById("inputF" + id).style.backgroundColor = "red";
    }
    else document.getElementById("inputF" + id).style.color = "black ";
}

function resetColorOfThePage() {
    document.getElementById("designName" + lastEditedRow).style.backgroundColor = document.getElementById("designNo" + lastEditedRow).style.backgroundColor = document.getElementById("shadeNo" + lastEditedRow).style.backgroundColor = document.getElementById("inputG" + lastEditedRow).style.backgroundColor = document.getElementById("inputD" + lastEditedRow).style.backgroundColor = document.getElementById("inputF" + lastEditedRow).style.backgroundColor = document.getElementById("balanceStock" + lastEditedRow).style.backgroundColor = document.getElementById("lockingValue" + lastEditedRow).style.backgroundColor = "white";
    var table = document.getElementById("stockTableBody");
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (parseFloat(table.rows[r].cells[3].children[0].value) < 0) {
            table.rows[r].cells[3].children[0].style.backgroundColor = "#ff6666";
        } else table.rows[r].cells[3].children[0].style.backgroundColor = "white";

        if (parseFloat(table.rows[r].cells[4].children[0].value) < 0) {
            table.rows[r].cells[4].children[0].style.backgroundColor = "#ff6666";
        } else table.rows[r].cells[4].children[0].style.backgroundColor = "white";

        if (parseFloat(table.rows[r].cells[5].children[0].value) < 0) {
            table.rows[r].cells[5].children[0].style.backgroundColor = "#ff6666";
        } else table.rows[r].cells[5].children[0].style.backgroundColor = "white";

        if (parseFloat(table.rows[r].cells[6].children[0].value) < 0) {
            table.rows[r].cells[6].children[0].style.backgroundColor = "#ff6666";
        } else table.rows[r].cells[6].children[0].style.backgroundColor = "white";

        if (parseFloat(table.rows[r].cells[7].children[0].value) < 0) {
            table.rows[r].cells[7].children[0].style.backgroundColor = "#ff6666";
        } else table.rows[r].cells[7].children[0].style.backgroundColor = "white";
    }
}

function deleteRow(context) {

    var parEle = context.id;
    var tempID = context.id.split("deleteButton");
    var parEle = getQueryData(tempID[1]);
    var designN = parEle[0];
    var designNo = parEle[1];
    var shadeN = parEle[2];

    if (confirm("Are you sure to DELETE the category " + designN + " - " + designNo + " - " + shadeN + " ? ", "P-IT")) {
        connection.query("DELETE from openingstock WHERE designName = '" + designN + "' AND designNo ='" + designNo + "' AND shadeNo ='" + shadeN + "';",
            function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        var row = context.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

function resetErrorMessage() {
    document.getElementById("username").value = null;
    document.getElementById("password").value = null;
    document.getElementById("errorMessage").hidden = true;
}