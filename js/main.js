/* GET JSON REQUEST */
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
            var nextItem = dataJSON[j].Afspraak.Id;
            var currentItem = dataJSON[currentIndex].Afspraak.Id;
            // Check if next item is lower than the current item
            if(nextItem < currentItem){
                // If true set current index variable to that item 
                currentIndex = j;  
            }
        }
        /* Swap values of the dataJSONay based of the check */
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
function generateTable(sortedDataJSON) {
    // Make basic HTML template with table headers 
    html = "<table class='table'>";
    html += "<thead>" +
            "<tr>" +
                "<th>ID: </th>" +
                "<th>Klant naam: </th>" +
                "<th>Klant adres: </th>" +
                "<th>Gewenst tijdstip: </th>" +
                "<th>Dichtsbijzijnde halte: </th>" +
                "<th>Afstand halte: </th>" +
                "<th>Reden afspraak: </th>" +
                "<th>Monteur: </th>" +
            "</tr>" +
            "</thead>";
    // Loop through array and add table cells
    for (var i=0; i< sortedDataJSON.length; i++) {
        html += "<tr>" + 
                    "<td>" + sortedDataJSON[i].Afspraak.Id + "</td>" + 
                    "<td>" + sortedDataJSON[i].Afspraak.naamKlant + "</td>" + 
                    "<td>" + sortedDataJSON[i].Afspraak.adresKlant + "</td>" + 
                    "<td>" + sortedDataJSON[i].Afspraak.gewenstTijdstip + "</td>" +
                    "<td>" + sortedDataJSON[i].Afspraak.dichtsbijzijndeHalte + "</td>" +
                    "<td>" + sortedDataJSON[i].Afspraak.afstandHalte + "</td>" +
                    "<td>" + sortedDataJSON[i].Afspraak.redenAfspraak + "</td>" +
                    "<td>" + sortedDataJSON[i].Afspraak.naamMonteur + "</td>" +
                "</tr>";
    }
    html += "</table>";

    // Insert HTML table in div
    document.getElementById("data").innerHTML += html;
}

/* ASSIGN CLICK LISTENER TO BUTTON */
const importJSONButton = document.getElementById('importJSON');

importJSONButton.addEventListener('click', event => {
    getDefaultAfspraken();
});


function CreatePlan() {
    const els = document.getElementById("Createplandiv").getElementsByTagName("input");

    var xhr = new XMLHttpRequest();
    var url = "json/defaultAfspraken.json";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
        }
    };
    var data = JSON.stringify([{
        "Afspraak": {
            "Id": 99,
            "naamKlant": els[0].value,
            "adressKlant": els[1].value,
            "gewenstTijdstip": els[2].value,
            "dichtbijzijndeHalte": els[3].value,
            "afstandHalte": els[4].value,
            "redenAfspraak": els[5].value,
            "naamMonsteur": els[6].value
        }
    }]);
    console.log(data);
    
    xhr.send(data);

}
const createPlanButton = document.getElementById('createPlan');

createPlanButton.addEventListener('click', event => {
    CreatePlan();
});