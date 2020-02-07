/*
    GLOBAL VARIABLES
*/
const arrayGVBNumbers = ['GVB_1_1', 'GVB_2_1', 'GVB_3_1', 'GVB_4_1', 'GVB_5_1', 'GVB_7_1', 'GVB_11_1', 'GVB_12_1', 'GVB_13_1', 'GVB_14_1', 'GVB_17_1', 'GVB_19_1', 'GVB_24_1', 'GVB_26_1', 'GVB_50_1', 'GVB_51_1', 'GVB_52_1', 'GVB_53_1', 'GVB_54_1', ];
var arrayStops = [];

/*
    US 1 START
*/

/* GET REQUEST */
function loadJSONRequest(callback, URL) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', 'json/' + URL, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send();

}

/* LOAD RESPONSE */
function getDefaultAfspraken() {
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        const dataJSON = JSON.parse(response);
        // Sort array
        selectionSort(dataJSON);
    }, 'defaultAfspraken.json');
}

/* SELECTION SORT ARRAY */
function selectionSort(dataJSON) {
    // Loop through whole array
    for (var i = 0; i < dataJSON.length; i++) {
        // current index
        var currentIndex = i;
        // Loop from the next value of the dataJSONay
        for (var j = i + 1; j < dataJSON.length; j++) {
            var nextItem = dataJSON[j].Afspraak.gewenstTijdstip;
            var currentItem = dataJSON[currentIndex].Afspraak.gewenstTijdstip;
            // Check if next item is greater than the current item
            if (nextItem > currentItem) {
                // If true set current index variable to that item
                currentIndex = j;
            }
        }
        /* Swap values of the dataJSON based of the check */
        // Set value of current item as a temporary variable
        var temporaryFirstItem = dataJSON[i];
        // Swap current item value with the next item value
        dataJSON[i] = dataJSON[currentIndex];
        // Use temporary variable because the current item value has been replaced
        dataJSON[currentIndex] = temporaryFirstItem;
    }
    generateTable(dataJSON);
}

/* GENERATE HTML TABLE WITH SORTED JSON */
function generateTable(sortedDataJson) {
    // Empty data div
    document.getElementById("data").innerHTML = '';

    // Make basic HTML template with table headers
    html = '<table id="appointmentTable" class="table">';
    html += '<thead>' +
        '<tr>' +
        '<th>Klant naam: </th>' +
        '<th>Klant adres: </th>' +
        '<th>Gewenst tijdstip: </th>' +
        '<th>Dichtsbijzijnde halte: </th>' +
        '<th>Afstand halte: </th>' +
        '<th>Reden afspraak: </th>' +
        '<th>Monteur: </th>' +
        '</tr>' +
        '</thead>';
    // Loop through array and add table cells
    for (var i = 0; i < sortedDataJson.length; i++) {

        html += '<tr>' +
            '<td>' + sortedDataJson[i].Afspraak.naamKlant + '</td>' +
            '<td>' + sortedDataJson[i].Afspraak.adresKlant + '</td>' +
            '<td>' + sortedDataJson[i].Afspraak.gewenstTijdstip + '</td>' +
            '<td>' + sortedDataJson[i].Afspraak.dichtsbijzijndeHalte + '</td>' +
            '<td>' + sortedDataJson[i].Afspraak.afstandHalte + '</td>' +
            '<td>' + sortedDataJson[i].Afspraak.redenAfspraak + '</td>' +
            '<td>' + sortedDataJson[i].Afspraak.naamMonteur + '</td>' +
            '</tr>';
    }
    html += '</table>';

    var table = document.getElementsByClassName("afsprakenTable")[0];
    if (table != undefined) {
        table.parentNode.removeChild(table);

    }
    document.getElementById("data").innerHTML += html;
    // Display input fields
    document.getElementById('CreateAppointmentdiv').style.display = 'block';
    
}

/*
    US 1 END
*/

/* 
    US 2 START
*/
/* INSERT NEW ROW */
function insertNewRow() {
    const inputFields = document.getElementsByClassName('inputField');
    const appointmentTable = document.getElementById('appointmentTable');
    const tableRowCount = appointmentTable.rows.length;
    const row = appointmentTable.insertRow(tableRowCount);

    for (let i = 0; i < 7; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = inputFields[i].value;
    }

}

var dropdownClosest = document.getElementById('dropdownClosest');

function populateClosest() {
    loadJSONRequest(function (response) {
        const dataJSON = JSON.parse(response);
        generateOptionElements1(dataJSON);
    }, 'defaultAfspraken.json');
};

function generateOptionElements1(dataJSONResponse) {
    var options = '';

    for (var i = 0; i < dataJSONResponse.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = dataJSONResponse[i].Afspraak.dichtsbijzijndeHalte;
        options += option.outerHTML;
    }
    dropdownClosest.innerHTML = options;
}
/* 
    US 2 END
*/

/*
    US 3 START
 */
function sortAppointments() {
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        //hash table length
        var a = 97;
        //array containing hashtable
        var charArray = {};
        for (var i = 0; i < 27; i++) {
            //assign value based on position
            charArray[String.fromCharCode(a + i)] = i;
            if (i == 26) {
                //add dot to hashtable
                charArray["."] = 0;
            }
        }
        //assign value to each letter in naamKlant and push naamvalue into the afspraak object
        for (var i = 0; i < dataJSON.length; i++) {
            var namevalue = 0;
            for (var p = 0; p < Object.keys(charArray).length; p++) {
                // match letter to number and add number to namevalue sum
                if (dataJSON[i].Afspraak.naamKlant.charAt(0) === Object.keys(charArray)[p].toUpperCase()) {
                    dataJSON[i].Afspraak['namevalue'] = charArray[Object.keys(charArray)[p]];
                }
            }

        }


        function swap(items, leftIndex, rightIndex) {
            // assign index places
            var temp = items[leftIndex];
            items[leftIndex] = items[rightIndex];
            items[rightIndex] = temp;
        }

        function partition(items, left, right) {
            //assign pivoting element
            var pivot = items[Math.floor((right + left) / 2)].Afspraak.namevalue,
                //assign left and right vlue
                i = left,
                j = right;
            while (i <= j) {
                // if items are less then pivot assign to left
                while (items[i].Afspraak.namevalue < pivot) {
                    i++;
                }
                //if items are more than pivot assign to right
                while (items[j].Afspraak.namevalue > pivot) {
                    j--;
                }
                if (i <= j) {
                    //if two items arent in order swap them
                    swap(items, i, j); //sawpping two elements
                    i++;
                    j--;
                }
            }
            //return index
            return i;
        }

        function quickSort(items, left, right) {
            var index;
            if (items.length > 1) {
                index = partition(items, left, right); //index returned from partition
                if (left < index - 1) { //more elements on the left side of the pivot
                    quickSort(items, left, index - 1);
                }
                if (index < right) { //more elements on the right side of the pivot
                    quickSort(items, index, right);
                }
            }
            return items;
        }

        generateTable(quickSort(dataJSON, 0, dataJSON.length - 1));
    }, 'defaultAfspraken.json');
}

function costumerNameSearch() {
    var input = document.getElementById('searchCostumerInput').value.toLowerCase();
    if (input != "") {
        var found = [];
        loadJSONRequest(function (response) {
            // Parse JSON string into object
            var dataJSON = JSON.parse(response);
            // match name & push into element
            for (var i = 0; i < dataJSON.length; i++) {
                if (dataJSON[i].Afspraak.naamKlant.toLowerCase().includes(input)) {
                    var obj = dataJSON[i];
                    found.push(obj);
                }
            }
            generateTable(found);
        }, 'defaultAfspraken.json');
    } else {
        window.alert("Je moet een naam invoeren");
    }
}
/*
    US 3 END
 */

/* 
    US 4 START
*/

/* SEARCH APPOINTMENT BASED ON MECHANIC NAME */
function appointmentMechanicSearch() {
    var input = document.getElementById('searchMechanicInput').value.toLowerCase();
    if (input != "") {
        var found = [];
        loadJSONRequest(function (response) {
            // Parse JSON string into object
            var dataJSON = JSON.parse(response);
            for (var i = 0; i < dataJSON.length; i++) {
                if (dataJSON[i].Afspraak.naamMonteur.toLowerCase().includes(input)) {
                    var obj = dataJSON[i];
                    found.push(obj);
                }
            }
            generateTable(found);
        }, 'defaultAfspraken.json');
    } else {
        window.alert("Je moet een naam invoeren");
    }
}

/*
    US 4 END
*/

/*
    US 5 START
*/
/* SEARCH APPOINTMENT BASED ON MECHANIC NAME */
function getGVBInfo(number) {
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        const firstNetworkKey = Object.keys(dataJSON[number].Network)[0];
        var objective = dataJSON[number].Network[firstNetworkKey];
        //console.log(objective);
        var objectKeys = Object.keys(objective);
        //console.log(number);
        for (let i = 1; i < (objectKeys.length + 1); i++) {
            // console.log(objective[i].TimingPointName);
            var stopName = objective[i].TimingPointName;
            // console.log(arrayStops.includes(stopName) + ' ' + stopName);

            if (arrayStops.includes(stopName) === false) {
                arrayStops.push(stopName);
            }
        }

        populateStarts();
        populateStops();
        populateClosest();
        //console.log(arrayStops);


    }, 'GVB/' + number + '.json');

}

function populateStarts() {
    var startDropdown = document.getElementById('searchStartPointDropdown');
    var startOptions = '';

    for (var i = 0; i < arrayStops.length; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = arrayStops[i];
        startOptions += option.outerHTML;

    }
    startDropdown.innerHTML = startOptions;
};

function populateStops() {
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        const dataJSON = JSON.parse(response);
        generateOptionElements(dataJSON);
    }, 'defaultAfspraken.json');
};

function generateOptionElements(dataJSONResponse) {
    var stopDropdown = document.getElementById('searchEndPointDropdown');
    var StopOptions = '';

    for (var i = 0; i < dataJSONResponse.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = dataJSONResponse[i].Afspraak.dichtsbijzijndeHalte;
        StopOptions += option.outerHTML;
    }
    stopDropdown.innerHTML = StopOptions;
}

/*
    US 5 END
*/

/* ASSIGN CLICK LISTENER TO BUTTON */
const importJSONButton = document.getElementById('importJSONButon');

importJSONButton.addEventListener('click', event => {
    getDefaultAfspraken();
});
const searchButton = document.getElementById('searchMechanicButton');

searchButton.addEventListener('click', event => {
    appointmentMechanicSearch();
});

const sortAppointmentButton = document.getElementById('sortAppointmentButton');

sortAppointmentButton.addEventListener('click', event => {
    sortAppointments();
});

const searchCostumerNameButton = document.getElementById('searchCostumerButton');

searchCostumerNameButton.addEventListener('click', event => {
    costumerNameSearch();
});

//getGVBInfo(arrayGVBNumbers[0])
for (let i = 0; i < arrayGVBNumbers.length; i++) {
    getGVBInfo(arrayGVBNumbers[i]);
}

const createAppointmentButton = document.getElementById('createAppointmentButton');

createAppointmentButton.addEventListener('click', event => {
    insertNewRow();
});