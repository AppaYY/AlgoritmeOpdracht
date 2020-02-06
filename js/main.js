/* 
    GLOBAL VARIABLES
*/
const arrayGVBNumbers = ['GVB_1_1', 'GVB_2_1', 'GVB_3_1', 'GVB_4_1', 'GVB_5_1', 'GVB_7_1', 'GVB_11_1', 'GVB_12_1', 'GVB_13_1', 'GVB_14_1', 'GVB_17_1', 'GVB_19_1', 'GVB_24_1', 'GVB_26_1', 'GVB_50_1', 'GVB_51_1', 'GVB_52_1', 'GVB_53_1', 'GVB_54_1',];
var arrayStops = [];
var startPointDropdown = document.getElementById('searchStartPointDropdown');
var endPointDropdown = document.getElementById('searchEndPointDropdown');

/* 
    US 1 START
*/
/* GET REQUEST */
function loadJSONRequest(callback, URL) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', 'json/' + URL, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
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
    html = '<table class="table">';
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
}
/* 
    US 1 END
*/

/* 
    US 4 START
*/
/* SEARCH APPOINTMENT BASED ON MECHANIC NAME */
function appointmentMechanicSearch() {
    var input = document.getElementById('searchMechanicInput').value.toLowerCase();
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
        //console.log(arrayStops);


    }, 'GVB/' + number + '.json');

}

function compareSelected() {
    var selectedStart = startPointDropdown.value;
    var selectedEnd = endPointDropdown.value;
    console.log(selectedStart);
    console.log(selectedEnd);

    if (selectedEnd == selectedStart) {
        console.log("U hebt twee dezelfde adressen ingevuld. Vul een ander adres in.");
    }//Moeten nog een map maken
}

function populateStarts() {
    var startPointOptions = '';

    for (var i = 0; i < arrayStops.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = arrayStops[i];
        startPointOptions += option.outerHTML;

    }
    startPointDropdown.innerHTML = startPointOptions;
};

function populateEnds() {
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        const dataJSON = JSON.parse(response);
        generateOptionElements(dataJSON);
    }, 'defaultAfspraken.json');
};

function generateOptionElements(dataJSONResponse) {
    var endPointOptions = '';

    for (var i = 0; i < dataJSONResponse.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = dataJSONResponse[i].Afspraak.dichtsbijzijndeHalte;
        endPointOptions += option.outerHTML;
        console.log(dataJSONResponse[i].Afspraak.dichtsbijzijndeHalte);
        
    }
    endPointDropdown.innerHTML = endPointOptions;
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

const compareButton = document.getElementById("dropdownButton");

compareButton.addEventListener('click', event => {
    compareSelected();
});

//getGVBInfo(arrayGVBNumbers[0])
for (let i = 0; i < arrayGVBNumbers.length; i++) {
    getGVBInfo(arrayGVBNumbers[i]);
};

populateEnds();

// making  graph
