/*
    US 1 START
*/
/* GET REQUEST */
function loadJSONRequest(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/defaultAfspraken.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
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
    });
}
/*
    US 4 END
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

function sortAppointments(){
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        console.log(dataJSON);
        var a = 97;
        var charArray = {};
        for (var i = 0; i<27; i++){
            charArray[String.fromCharCode(a + i)] = i;
            if (i == 26){
                console.log(26);
                charArray["."] = 0;
            }
        }

        for (var i=0; i<dataJSON.length; i++){
            var namevalue = 0;
            var naam = dataJSON[i].Afspraak.naamKlant;

            for(var y=0; y <naam.length;y++){
                for (var p=0;p < Object.keys(charArray).length;p++){
                    if (dataJSON[i].Afspraak.naamKlant.charAt(y) == Object.keys(charArray)[p]){
                        namevalue = namevalue + charArray[Object.keys(charArray)[p]];
                        dataJSON[i].Afspraak.namevalue = namevalue;
                    }
                }
            }
            console.log(dataJSON[i]);

        }

        var items = [5,3,7,6,2,9];
        function swap(items, leftIndex, rightIndex){
            var temp = items[leftIndex];
            items[leftIndex] = items[rightIndex];
            items[rightIndex] = temp;
        }
        function partition(items, left, right) {
            var pivot   = items[Math.floor((right + left) / 2)].Afspraak.namevalue, //middle element
                i       = left, //left pointer
                j       = right; //right pointer
            while (i <= j) {
                while (items[i].Afspraak.namevalue < pivot) {
                    i++;
                }
                while (items[j].Afspraak.namevalue > pivot) {
                    j--;
                }
                if (i <= j) {
                    swap(items, i, j); //sawpping two elements
                    i++;
                    j--;
                }
            }
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
// first call to quick sort
       // var sortedArray = quickSort(items, 0, items.length - 1);
        var sortedArray = quickSort(dataJSON, 0, dataJSON.length - 1);
        console.log(sortedArray); //prints [2,3,5,6,7,9]





    });
}