/* 
    US 1 START
*/
/* GET REQUEST */
function loadJSONRequest(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', 'json/defaultAfspraken.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
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
    });
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
/* SEARCH APPOINTMENT BASED ON CLIENT NAME */
function afspraakZoeken() {
    var input = document.getElementById('searchClientInput').value;
    var found = [];
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        for (var i = 0; i < dataJSON.length; i++) {
            if (dataJSON[i].Afspraak.naamMonteur.includes(input)) {
                var obj = dataJSON[i];
                found.push(obj);
            }
        }
        generateTable(found);
    });
}
/* 
    US 4 END
*/

/* 
    US 2 START
*/
/* POST JSON REQUEST */
function postAfspraakRequest(callback) {
    const inputFields = document.getElementsByClassName('inputField');

    var xobj = new XMLHttpRequest();
    var url = 'json/defaultAfspraken.json';
    xobj.open('POST', url, true);
    xobj.setRequestHeader('Content-Type', 'application/json');
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    var data = JSON.stringify([{
        'Afspraak': {
            'Id': 99,
            'naamKlant': inputFields[0].value,
            'adressKlant': inputFields[1].value,
            'gewenstTijdstip': inputFields[2].value,
            'dichtbijzijndeHalte': inputFields[3].value,
            'afstandHalte': inputFields[4].value,
            'redenAfspraak': inputFields[5].value,
            'naamMonsteur': inputFields[6].value
        }
    }]);
    xobj.send(data);
}

function postAfspraak() {
    postAfspraakRequest(function (response) {
        // Parse JSON string into object
        const dataJSON = JSON.parse(response);
        console.log(dataJSON);
    });
}
/* 
    US 2 END
*/

/* ASSIGN CLICK LISTENER TO BUTTON */
const importJSONButton = document.getElementById('importJSONButon');

importJSONButton.addEventListener('click', event => {
    getDefaultAfspraken();
});

const createAppointmentButton = document.getElementById('createAppointmentButton');

createAppointmentButton.addEventListener('click', event => {
    postAfspraak();
});

const searchButton = document.getElementById('searchClientButton');

searchButton.addEventListener('click', event => {
    afspraakZoeken();
});
