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
    xobj.send(null);
}

/* LOAD RESPONSE */
function getDefaultAfspraken() {
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        const dataJSON = JSON.parse(response);
        // Sort array
        selectionSort(dataJSON);
        
        // /* TEST CONSOLE LOG */
        // console.log(dataJSON);
        // setTimeout(function(){
        //     /* SELECTION SORT */
        //     selectionSort(dataJSON);
        // }, 3000);
    });
}

/* SELECTION SORT ARRAY */
function selectionSort(dataJSON){
    // Loop through whole array
    for(var i = 0; i < dataJSON.length; i++){
        // current index
        var currentIndex = i;
        // Loop from the next value of the dataJSONay
        for(var  j = i + 1; j < dataJSON.length; j++){
            var nextItem = dataJSON[j].Afspraak.gewenstTijdstip;
            var currentItem = dataJSON[currentIndex].Afspraak.gewenstTijdstip;
            // Check if next item is greater than the current item
            if(nextItem > currentItem){
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
function generateTable(DataJson) {
    // Make basic HTML template with table headers
    html = '<table class="afsprakenTable">';
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
    for (var i = 0; i < DataJson.length; i++) {
        html += '<tr>' +
            '<td>' + DataJson[i].Afspraak.naamKlant + '</td>' +
            '<td>' + DataJson[i].Afspraak.adresKlant + '</td>' +
            '<td>' + DataJson[i].Afspraak.gewenstTijdstip + '</td>' +
            '<td>' + DataJson[i].Afspraak.dichtsbijzijndeHalte + '</td>' +
            '<td>' + DataJson[i].Afspraak.afstandHalte + '</td>' +
            '<td>' + DataJson[i].Afspraak.redenAfspraak + '</td>' +
            '<td>' + DataJson[i].Afspraak.naamMonteur + '</td>' +
            '</tr>';
    }
    html += '</table>';

    var table = document.getElementsByClassName("afsprakenTable")[0];
    if (table != undefined) {
        table.parentNode.removeChild(table);
    }
    document.getElementById("data").innerHTML += html;

}

/* ASSIGN CLICK LISTENER TO BUTTON */
const importJSONButton = document.getElementById('importJSON');

importJSONButton.addEventListener('click', event => {
    getDefaultAfspraken();
});
const searchButton = document.getElementById('afspraakZoeken');

searchButton.addEventListener('click', event => {
    afspraakZoeken();
});

function afspraakZoeken() {

var el = document.getElementById("afspraakzoekendiv").childNodes;
var input = document.getElementsByTagName("input")[0];
var found = [];
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        for (var i=0;i<dataJSON.length;i++){
            if (dataJSON[i].Afspraak.naamMonteur == input.value){
                var obj = dataJSON[i];
                found.push(obj);
            }
        }
        generateTable(found);
    });
}