var jsPDF = require('jspdf');
require('jspdf-autotable');
var dbOpeningStockValues = "";
var lastEditedRow = 1;

function generate() {
    var doc = new jsPDF();
    var table = document.getElementById("stockTable");
    var ths = table.getElementsByTagName("th");
    var headarr = [];
    var text = "Hi How are you",
        xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
    doc.text('Montex India: Stock Report', 70, 10);
    var bodyData = [];
    for (var s = 0; s <= 7; s++) {
        headarr.push(ths[s].innerHTML);
    }

    for (var r = 1; r < table.rows.length - 1; r++) {
        var temp = [table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[1].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[2].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[4].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[5].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[6].getElementsByTagName("input")[0].value.trim(), table.rows[r].cells[7].getElementsByTagName("input")[0].value.trim()];
        bodyData.push(temp);
    }
    doc.autoTable({
        head: [['Design Name', 'Design No', 'Shade No', 'In Prod', 'In Dyeing', 'Finish', 'Balance', 'Total Orders']],
        body: bodyData
    });
    var pageCount = doc.internal.getNumberOfPages();

    for (i = 0; i < pageCount; i++) {
        doc.setPage(i);
        doc.text(150, 285, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount + " page");
    }
    var m = (new Date(Date.now()).getMonth()) + 1;
    var folderName = (new Date(Date.now()).getDate() + "" + m + "" + new Date(Date.now()).getFullYear()).toString();
    doc.save(folderName + '-Stock-Order-Report.pdf');
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
            newCell = document.createElement("td");
            newCell.id = "designName" + i;
            newCell.style = "text-align: center; vertical-align: middle;";
            newCell.textContent = dbOpeningStockValues[i].designName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.id = "designNo" + i;
            newCell.style = "text-align: center; vertical-align: middle;";
            newCell.textContent = dbOpeningStockValues[i].designNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.id = "shadeNo" + i;
            newCell.style = "text-align: center; vertical-align: middle;";
            newCell.textContent = dbOpeningStockValues[i].shadeNo;
            newRow.appendChild(newCell);

            var currentCell = newRow.insertCell(-1);
            var greyInputBox = document.createElement("input");
            greyInputBox.setAttribute("type", "number");
            greyInputBox.setAttribute("id", "inputG" + i);
            greyInputBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em;");
            greyInputBox.setAttribute("value", dbOpeningStockValues[i].inGrey);
            greyInputBox.setAttribute("onfocus", "this.oldvalue = this.value");
            greyInputBox.setAttribute("onchange", "onGreyChange(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].inGrey) < 0)
                greyInputBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; background-color: #ff6666;");
            currentCell.appendChild(greyInputBox);

            currentCell = newRow.insertCell(-1);
            var dyeingInputBox = document.createElement("input");
            dyeingInputBox.setAttribute("type", "number");
            dyeingInputBox.setAttribute("id", "inputD" + i);
            dyeingInputBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em;");
            dyeingInputBox.setAttribute("value", dbOpeningStockValues[i].inDyeing);
            dyeingInputBox.setAttribute("onfocus", "this.oldvalue = this.value");
            dyeingInputBox.setAttribute("onchange", "onDyeingChange(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].inDyeing) < 0)
                dyeingInputBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; background-color: #ff6666;");
            currentCell.appendChild(dyeingInputBox);

            currentCell = newRow.insertCell(-1);
            var qtyBox = document.createElement("input");
            qtyBox.setAttribute("type", "number");
            qtyBox.setAttribute("id", "inputF" + i);
            qtyBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; ");
            qtyBox.setAttribute("value", dbOpeningStockValues[i].qty);
            qtyBox.setAttribute("onfocus", "this.oldvalue = this.value");
            qtyBox.setAttribute("onchange", "onFinishChange(this); this.oldvalue = this.value");
            if (parseFloat(dbOpeningStockValues[i].qty) < 0)
                qtyBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; background-color: #ff6666;");
            currentCell.appendChild(qtyBox);

            newCell = document.createElement("td");
            newCell.id = "balanceStock" + i;
            newCell.style = "text-align: center; vertical-align: middle;";
            var balanceStk = (parseFloat(dbOpeningStockValues[i].inGrey) + parseFloat(dbOpeningStockValues[i].inDyeing) + parseFloat(dbOpeningStockValues[i].qty));
            newCell.textContent = balanceStk.toString();
            if (parseFloat(balanceStk) < 0)
                newCell.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; background-color: #ff6666;");
            newRow.appendChild(newCell);

            currentCell = newRow.insertCell(-1);
            var qtyBox = document.createElement("input");
            qtyBox.setAttribute("type", "number");
            qtyBox.setAttribute("id", "lockingValue" + i);
            qtyBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; ");
            qtyBox.setAttribute("value", dbOpeningStockValues[i].lockingValue);
            qtyBox.setAttribute("onfocus", "this.oldvalue = this.value");
            qtyBox.setAttribute("onchange", "changeTotalOrderQty(this); this.oldvalue = this.value");
            currentCell.appendChild(qtyBox);

            currentCell = newRow.insertCell(-1);
            var qtyBox = document.createElement("input");
            qtyBox.setAttribute("type", "number");
            qtyBox.setAttribute("id", "orderQty" + i);
            qtyBox.setAttribute("style", "text-align: center; vertical-align: middle; width: 6em; ");
            qtyBox.setAttribute("onchange", "performCalc(this); this.oldvalue = this.value");
            currentCell.appendChild(qtyBox);
        }
    }
}

function onGreyChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("inputG");
    if (parseFloat(val.oldvalue) > parseFloat(val.value)) {
        document.getElementById("inputG" + tempID[1]).value = val.oldvalue;
        document.getElementById("inputG" + tempID[1]).style.backgroundColor = "#ff6666";

    } else if (!isNaN((val.value) || (val.value.indexOf('.') != -1))) {
        var queryData = getQueryData(tempID[1]);
        logTheChange(queryData, val.oldvalue, val.value, 1);
        connection.query("UPDATE openingstock as t1, (select inGrey from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.inGrey = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;

                document.getElementById(val.id).style.backgroundColor = "lightgreen";
                document.getElementById("balanceStock" + tempID[1]).style.backgroundColor = "lightgreen";
            });
    } else {
        document.getElementById("inputG" + tempID[1]).value = val.oldvalue;
    }

    lastEditedRow = parseInt(tempID[1]);
    calculateBalanceStock(tempID[1]);
}

function onDyeingChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("inputD");
    if (parseFloat(val.oldvalue) < parseFloat(val.value)) {
        var dyeingQ = document.getElementById("inputG" + tempID[1]).value;
        var queryData = getQueryData(tempID[1]);
        if (!isNaN((val.value) || (val.value.indexOf('.') != -1))) {
            var diff = document.getElementById("inputG" + tempID[1]).value = (parseFloat(dyeingQ) - (parseFloat(val.value) - parseFloat(val.oldvalue))).toString();
            logTheChange(queryData, val.oldvalue, val.value, 2);
            connection.query("UPDATE openingstock as t1, (select inGrey, inDyeing from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.inGrey = '" + diff + "', t1.inDyeing = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
                function (err, result) {
                    if (err) throw err;
                    document.getElementById(val.id).style.backgroundColor = "lightgreen";
                    if (diff >= 0)
                        document.getElementById("inputG" + tempID[1]).style.backgroundColor = "lightgreen";
                    else document.getElementById("inputG" + tempID[1]).style.backgroundColor = "#ff6666";
                });
        } else {
            document.getElementById("inputG" + tempID[1]).value = val.oldvalue;
        }
    }
    else
        document.getElementById("inputD" + tempID[1]).value = val.oldvalue;
    lastEditedRow = parseInt(tempID[1]);
    calculateBalanceStock(tempID[1]);
}

function onFinishChange(val) {
    resetColorOfThePage();
    var tempID = val.id.split("inputF");
    if (parseFloat(val.oldvalue) < parseFloat(val.value)) {
        var dyeingQ = document.getElementById("inputD" + tempID[1]).value;
        var queryData = getQueryData(tempID[1]);
        if (!isNaN((val.value) || (val.value.indexOf('.') != -1))) {
            var diff = document.getElementById("inputD" + tempID[1]).value = (parseFloat(dyeingQ) - (parseFloat(val.value) - parseFloat(val.oldvalue))).toString();
            logTheChange(queryData, val.oldvalue, val.value, 3);
            connection.query("UPDATE openingstock as t1, (select inDyeing, qty from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.inDyeing = '" + diff + "', t1.qty = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
                function (err, result) {
                    if (err) throw err;
                    document.getElementById(val.id).style.backgroundColor = "lightgreen";
                    if (diff >= 0)
                        document.getElementById("inputD" + tempID[1]).style.backgroundColor = "lightgreen";
                    else document.getElementById("inputD" + tempID[1]).style.backgroundColor = "#ff6666";
                });

        } else document.getElementById("inputG" + tempID[1]).value = val.oldvalue;
    }
    else
        document.getElementById("inputF" + tempID[1]).value = val.oldvalue;

    lastEditedRow = parseInt(tempID[1]);
    calculateBalanceStock(tempID[1]);
}

function getQueryData(id) {
    var data = [];
    data.push(document.getElementById("designName" + id).innerHTML);
    data.push(document.getElementById("designNo" + id).innerHTML);
    data.push(document.getElementById("shadeNo" + id).innerHTML);
    return data;
}

function performCalc(val) {
    resetColorOfThePage();
    var index = val.id.split("orderQty");
    var currentOrder = val.value;
    if (currentOrder > 0) {

        var totalO = document.getElementById("lockingValue" + index[1]).value;
        var finishQ = document.getElementById("inputF" + index[1]).value;
        var queryData = getQueryData(index[1]);

        document.getElementById("balanceStock" + index[1]).style.backgroundColor = "lightgreen";

        totalO = document.getElementById("lockingValue" + index[1]).value = (parseFloat(totalO) + parseFloat(currentOrder)).toString();
        finishQ = document.getElementById("inputF" + index[1]).value = (parseFloat(finishQ) - parseFloat(currentOrder)).toString();

        if (totalO >= 0)
            document.getElementById("lockingValue" + index[1]).style.backgroundColor = "lightgreen";
        else document.getElementById("lockingValue" + index[1]).style.backgroundColor = "#ff6666";

        if (finishQ >= 0)
            document.getElementById("inputF" + index[1]).style.backgroundColor = "lightgreen";
        else document.getElementById("inputF" + index[1]).style.backgroundColor = "#ff6666";

        document.getElementById("orderQty" + index[1]).value = "";
        logTheChange(queryData, "0", currentOrder, 4);
        connection.query("UPDATE openingstock as t1, (select qty, lockingValue from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.qty = '" + finishQ + "', t1.lockingValue = '" + totalO + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
            });
        calculateBalanceStock(index[1]);
    } else document.getElementById(val.id).style.backgroundColor = "red";
    lastEditedRow = parseInt(index[1]);
}

function calculateBalanceStock(id) {
    document.getElementById("balanceStock" + id).innerHTML = (parseFloat(document.getElementById("inputG" + id).value) + parseFloat(document.getElementById("inputD" + id).value) + parseFloat(document.getElementById("inputF" + id).value)).toString();

    if (parseFloat(document.getElementById("balanceStock" + id).innerHTML) < 0)
        document.getElementById("balanceStock" + id).style.backgroundColor = "#ff6666";
    else document.getElementById("balanceStock" + id).style.backgroundColor = "white";

    if (parseFloat(document.getElementById("inputF" + id).value) <= 0)
        document.getElementById("inputF" + id).style.backgroundColor = "#ff6666";
    else document.getElementById("inputF" + id).style.backgroundColor = "white";
}

function changeTotalOrderQty(val) {
    resetColorOfThePage();
    var tempID = val.id.split("lockingValue");
    if (parseFloat(val.oldvalue) > parseFloat(val.value)) {
        var queryData = getQueryData(tempID[1]);
        connection.query("UPDATE openingstock as t1, (select lockingValue from openingstock where designName = '" + queryData[0] + "' AND designNo = '" + queryData[1] + "'  AND shadeNo = '" + queryData[2] + "' ) as t2 set t1.lockingValue = '" + val.value + "' where t1.designName = '" + queryData[0] + "'  AND t1.designNo = '" + queryData[1] + "'  AND t1.shadeNo = '" + queryData[2] + "';",
            function (err, result) {
                if (err) throw err;
            });
    } else
        document.getElementById("lockingValue" + tempID[1]).value = val.oldvalue;
}

function resetColorOfThePage() {
    document.getElementById("designName" + lastEditedRow).style.backgroundColor = document.getElementById("designNo" + lastEditedRow).style.backgroundColor = document.getElementById("shadeNo" + lastEditedRow).style.backgroundColor = document.getElementById("inputG" + lastEditedRow).style.backgroundColor = document.getElementById("inputD" + lastEditedRow).style.backgroundColor = document.getElementById("inputF" + lastEditedRow).style.backgroundColor = document.getElementById("balanceStock" + lastEditedRow).style.backgroundColor = document.getElementById("lockingValue" + lastEditedRow).style.backgroundColor = document.getElementById("orderQty" + lastEditedRow).style.backgroundColor = "white";
}

function logTheChange(qData, oldvalue, newvalue, keyValue) {
    var productName = qData[0] + "/" + qData[1] + "/" + qData[2];
    var logDate = getTodaysDate();
    var quantity = (parseFloat(newvalue) - parseFloat(oldvalue)).toString();
    console.log(oldvalue, newvalue, quantity);
    connection.query("Insert into applicationlogs VALUES ('" + logDate + "','" + productName.toUpperCase() + "','" + "0" + "','" + quantity + "','" + keyValue + "');",
        function (err, result) {
            if (err) throw err;
            console.log(result);
        });
}

function getTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return (dd + '/' + mm + '/' + yyyy);
}

function searchInTable() {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("stockTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        for (j = 0; j <= 7; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            //console.log(td);
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    if (filter.trim() == "" || filter.trim() == null)
        document.getElementById("printButton").disabled = false;
    else document.getElementById("printButton").disabled = true;
}

function printAllProducts() {

    var doc = new jsPDF();
    var table = document.getElementById("stockTable");
    var ths = table.getElementsByTagName("th");
    var headarr = [];
    var text = "Hi How are you",
        xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
    doc.text('Montex India: Stock Details', 70, 10);
    var bodyData = [];
    for (var s = 0; s <= 7; s++) {
        headarr.push(ths[s].innerHTML);
    }

    for (var r = 1; r < table.rows.length - 1; r++) {
        var temp = [table.rows[r].cells[0].innerHTML + " / " + table.rows[r].cells[1].innerHTML + " / " + table.rows[r].cells[2].innerHTML, table.rows[r].cells[3].children[0].value, table.rows[r].cells[4].children[0].value, table.rows[r].cells[5].children[0].value, table.rows[r].cells[6].innerHTML, table.rows[r].cells[7].children[0].value];
        bodyData.push(temp);
    }
    doc.autoTable({
        head: [['Designs', 'In Production (A)', 'In Dyeing (B)', 'Finish Qty (C)', 'Balance stock (A+B+C)', 'Total Orders']],
        body: bodyData
    });
    var pageCount = doc.internal.getNumberOfPages();

    for (i = 0; i < pageCount; i++) {
        doc.setPage(i);
        doc.text(150, 285, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount + " page");
    }
    var m = (new Date(Date.now()).getMonth()) + 1;
    var folderName = (new Date(Date.now()).getDate() + "" + "." + m + "" + "." + new Date(Date.now()).getFullYear()).toString();
    //print(doc);
    doc.save(folderName + '-Montex-India-Stock-Details.pdf');
}