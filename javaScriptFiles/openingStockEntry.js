var previousDesignName = "";
var previousDesignNo = "";
var jsPDF = require('jspdf');
require('jspdf-autotable');
var addRow = false;
var tableData = null;

function addValuesToDatabase() {
    if (validatePage() == 0)
        return;

    var dName = document.getElementById("designName").value.trim();
    var dNo = document.getElementById("designNo").value.trim();
    var sh = document.getElementById("shade").value.trim();
    var pcs = document.getElementById("pcs").value.trim();
    var qty = document.getElementById("qty").value.trim();

    connection.query("Insert into openingstock VALUES ('" + dName.toUpperCase() + "','" + dNo.toUpperCase() + "','" + sh.toUpperCase() + "','" + pcs + "','" + qty + "','" + "0" + "','" + "0" + "','" + "0" + "','" + "0" + "','" + "0" + "')",
        function (err, result) {
            if (err) throw err;
            console.log(result);
        });

    logTheChange(dName, dNo, sh, pcs, qty);
    loadMyValues();
}

function loadMyValues() {
    connection.query('SELECT * from openingstock ORDER BY designName, designNo, shadeNo', function (error, results, fields) {
        if (error) throw error;
        dbOpeningStockValues = results;
        tableData = results;
        loadValuesInTable(dbOpeningStockValues);
        clearValuesInForm();
    });
}

function clearValuesInForm() {
    document.getElementById("designName").value = null;
    document.getElementById("designNo").value = null;
    document.getElementById("shade").value = null;
    document.getElementById("pcs").value = null;
    document.getElementById("qty").value = null;
}

function loadValuesInTable(dbOpeningStockValues) {
    var t = "";
    var tableInstance = document.getElementById("stockTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < dbOpeningStockValues.length; i++) {
        newRow = document.createElement("tr");
        newRow.style = "text-align: center;";
        tableInstance.appendChild(newRow);
        if (dbOpeningStockValues[i] instanceof Array) {
            console.log("andar aaya?");
        } else {
            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].designName;
            newCell.setAttribute("id", "designName" + i);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");;
            newCell.textContent = dbOpeningStockValues[i].designNo;
            newCell.setAttribute("id", "designNo" + i);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].shadeNo;;
            newCell.setAttribute("id", "shadeNo" + i);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].pcs;
            newCell.setAttribute("id", "pcs" + i);
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].qty;
            newCell.setAttribute("id", "qty" + i);
            newRow.appendChild(newCell);

            newCell = document.createElement("input");
            newCell.setAttribute("id", "deleteButton" + i);
            newCell.setAttribute("type", "image");
            newCell.setAttribute("src", "../assets/img/deleteld.png");
            newCell.setAttribute("title", "Delete");
            newCell.setAttribute("class", "imageButton");
            newCell.setAttribute("onclick", "deleteRow(this)");
            newRow.appendChild(newCell);
        }
    }
}

function checkPreviousDesignValue(value) {
    if (value == previousDesignName)
        return null;
    else {
        previousDesignName = value;
        return previousDesignName;
    }
}

function checkPreviousDesignNoValue(value) {
    if (value == previousDesignNo)
        return null;
    else {
        previousDesignNo = value;
        return previousDesignNo;
    }
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
        for (j = 0; j <= 4; j++) {
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

function validatePage() {
    if (document.getElementById('designName').value == null || document.getElementById('designName').value == '') {
        document.getElementById('designName').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('designName').style.backgroundColor = "white";

    if (document.getElementById('designNo').value == null || document.getElementById('designNo').value == '') {
        document.getElementById('designNo').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('designNo').style.backgroundColor = "white";

    if (document.getElementById('shade').value == null || document.getElementById('shade').value == '') {
        document.getElementById('shade').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('shade').style.backgroundColor = "white";

    if (document.getElementById('qty').value == null || document.getElementById('qty').value == '') {
        document.getElementById('qty').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('qty').style.backgroundColor = "white"
}

function logTheChange(dName, dNo, sh, pcs, qty) {
    var productName = dName + "/" + dNo + "/" + sh;
    var logDate = getTodaysDate();

    connection.query("Insert into applicationlogs VALUES ('" + logDate + "','" + productName.toUpperCase() + "','" + pcs.toUpperCase() + "','" + qty + "','" + "0" + "');",
        function (err, result) {
            if (err) throw err;
            console.log(result);
        });
}

function getTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return (dd + '/' + mm + '/' + yyyy);
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
        var temp = [table.rows[r].cells[0].innerHTML, table.rows[r].cells[1].innerHTML, table.rows[r].cells[2].innerHTML, table.rows[r].cells[3].innerHTML, table.rows[r].cells[4].innerHTML];
        bodyData.push(temp);
    }
    doc.autoTable({
        head: [['DESIGN NAME', 'DESIGN NO.', 'SHADE NO', 'PCS', 'QTY']],
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

function deleteRow(currentContext) {
    var tempID = currentContext.id.split("deleteButton");
    var newProdC = document.getElementById("designName" + tempID[1]).innerHTML;
    var newProdN = document.getElementById("designNo" + tempID[1]).innerHTML;
    var newShadeNo = document.getElementById("shadeNo" + tempID[1]).innerHTML;

    if (confirm("Are you sure to DELETE the category " + newProdC + " - " + newProdN + " - " + newShadeNo + " ? ", "Kalash - IT Services")) {
        connection.query("DELETE from openingstock WHERE designName = '" + newProdC.toUpperCase() + "' AND designNo = '" + newProdN.toUpperCase() + "' AND shadeNo = '" + newShadeNo.toUpperCase() + "';",
            function (err, result) {
                if (err) throw err;
                //console.log(result);
            });
        loadMyValues();
    }
}

function checkIfExistAlready() {
    var newDesignName = document.getElementById("designName").value.trim();
    var newDesignNo = document.getElementById("designNo").value.trim();
    var newDesignShadeNo = document.getElementById("shade").value.trim();

    for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].designName == newDesignName.toUpperCase() && tableData[i].designNo == newDesignNo.toUpperCase() && tableData[i].shadeNo == newDesignShadeNo.toUpperCase()) {
            document.getElementById("designName").style.backgroundColor = "#ff6666";
            document.getElementById("designNo").style.backgroundColor = "#ff6666";
            document.getElementById("shade").style.backgroundColor = "#ff6666";
            document.getElementById("addRow").disabled = true;
            break;
        }
        else {
            document.getElementById("designName").style.backgroundColor = "white";
            document.getElementById("designNo").style.backgroundColor = "white";
            document.getElementById("shade").style.backgroundColor = "white";
            document.getElementById("addRow").disabled = false;
        }
    }
}