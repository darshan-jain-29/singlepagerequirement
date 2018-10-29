var jsPDF = require('jspdf');
require('jspdf-autotable');
var showRecords = "all";
var keyValue = 0;
var printPageHeading = "All Logs";

function loadLogs() {

    if (showRecords == "all") {
        connection.query("SELECT * from applicationlogs ORDER BY dateOfEntry DESC;", function (error, results, fields) {
            if (error) throw error;
            dbOpeningStockValues = results;
            document.getElementById("pcsHeading").hidden = false;
            loadValuesInTable(dbOpeningStockValues);
        });
    }
    else {
        connection.query("SELECT * from applicationlogs WHERE logKey ='" + keyValue + "' ORDER BY dateOfEntry DESC;", function (error, results, fields) {
            if (error) throw error;
            dbOpeningStockValues = results;
            document.getElementById("pcsHeading").hidden = true;
            loadValuesInTable(dbOpeningStockValues);
        });
    }
}

function loadValuesInTable(dbOpeningStockValues) {
    var tableInstance = document.getElementById("logsTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < dbOpeningStockValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);

        if (dbOpeningStockValues[i] instanceof Array) {
        } else {
            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].dateOfEntry;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");;
            newCell.textContent = dbOpeningStockValues[i].productName
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].quantity;
            newRow.appendChild(newCell);
            setRowColor(newRow, dbOpeningStockValues[i].logKey);

            if (showRecords == "productEntryLogs") {
                newCell = document.createElement("td");
                newCell.textContent = dbOpeningStockValues[i].pcs;
                newRow.appendChild(newCell);
            } else if (showRecords == "all") {
                newCell = document.createElement("td");

                switch (dbOpeningStockValues[i].logKey) {
                    case "0":
                        newCell.textContent = "Product Entry Log";
                        break;
                    case "1":
                        newCell.textContent = "Production Addition Log";
                        break;
                    case "2":
                        newCell.textContent = "Production to Dyeing Log";
                        break;
                    case "3":
                        newCell.textContent = "Dyeing to Finish Log";
                        break;
                    case "4":
                        newCell.textContent = "New Orders Log";
                        break;
                    default:
                        newCell.textContent = "Corrupted Log";
                        break;
                }
                newRow.appendChild(newCell);
            }
        }
    }
}

function setRowColor(newRow, id) {
    switch (id) {
        case "0":
            newRow.style.backgroundColor = "#98AFC7";
            break;
        case "1":
            newRow.style.backgroundColor = "#C0C0C0";
            break;
        case "2":
            newRow.style.backgroundColor = "#FFF8C6";
            break;
        case "3":
            newRow.style.backgroundColor = "#FFCBA4";
            break;
        case "4":
            newRow.style.backgroundColor = "#93FFE8";
            break;
        default:
            newRow.style.backgroundColor = "black";
            break;
    }
}

function printAllLogs() {
    var doc = new jsPDF();
    var table = document.getElementById("logsTable");
    var ths = table.getElementsByTagName("th");
    var headarr = [];
    var text = "Hi How are you",
        xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
    doc.text("Montex India: " + printPageHeading + " Report", 40, 10);

    var bodyData = [];
    for (var s = 0; s <= 7; s++) {
        headarr.push(ths[s].innerHTML);
    }

    for (var r = 1; r < table.rows.length - 1; r++) {
        var temp = [];
        if (showRecords == "all" || showRecords == "Product Entry Logs")
            temp = [table.rows[r].cells[0].innerHTML, table.rows[r].cells[1].innerHTML, table.rows[r].cells[2].innerHTML, table.rows[r].cells[3].innerHTML];
        else temp = [table.rows[r].cells[0].innerHTML, table.rows[r].cells[1].innerHTML, table.rows[r].cells[2].innerHTML];
        bodyData.push(temp);
    }
    if (showRecords == "all") {
        doc.autoTable({
            head: [['Date', 'Product Name', 'Quantity', 'All Logs']],
            body: bodyData
        });
    } else if (showRecords == "Product Entry Logs") {
        doc.autoTable({
            head: [['Date', 'Product Name', 'Quantity', 'Pieces']],
            body: bodyData
        });
    } else {
        doc.autoTable({
            head: [['Date', 'Product Name', 'Quantity']],
            body: bodyData
        });
    }

    var pageCount = doc.internal.getNumberOfPages();

    for (i = 0; i < pageCount; i++) {
        doc.setPage(i);
        doc.text(150, 285, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount + " page");
    }
    var m = (new Date(Date.now()).getMonth()) + 1;
    var folderName = (new Date(Date.now()).getDate() + "" + m + "" + new Date(Date.now()).getFullYear()).toString();
    doc.save(folderName + '-' + printPageHeading + '-Report.pdf');
}

function showLogs(currentValue) {
    switch (currentValue) {
        case "0":
            showRecords = "all";
            printPageHeading = "All Logs";
            break;
        case "1":
            showRecords = "Product Entry Log";
            printPageHeading = "Product Entry Logs";
            keyValue = 0;
            break;
        case "2":
            showRecords = "Production Addition Log";
            printPageHeading = "Production Addition Logs";
            keyValue = 1;
            break;
        case "3":
            showRecords = "Production to Dyeing Log";
            printPageHeading = "Production to Dyeing Logs";
            keyValue = 2;
            break;
        case "4":
            showRecords = "Dyeing to Finish Log";
            printPageHeading = "Dyeing to Finish Logs";
            keyValue = 3;
            break;
        case "5":
            showRecords = "New Orders Log";
            printPageHeading = "New Orders Logs";
            keyValue = 4;
            break;
        default:
            showRecords = "Corrupted Log";
            printPageHeading = "Corrupted Logs";
            keyValue = 1000;
            break;
    }
    loadLogs();
}

function searchInTable() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchBar");
    filter = input.value.toUpperCase();
    table = document.getElementById("logsTable");
    tr = table.getElementsByTagName("tr");
    var printDisableCounter = 0;
    var i = null;

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length - 1; i++) {
        for (j = 0; j <= 4; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            //console.log(td);
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    printDisableCounter = 1;
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    if (filter.trim() == "" || filter.trim() == null)
        document.getElementById("printButton").disabled = false;
    else if (printDisableCounter == 1 || printDisableCounter == 0)
        document.getElementById("printButton").disabled = true;
    else document.getElementById("printButton").disabled = false;
}