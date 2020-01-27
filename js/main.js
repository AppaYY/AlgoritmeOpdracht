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

function getDefaultAfspraken() {
    console.log("hi");
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        console.log(dataJSON);
        
        // DRAW THE HTML TABLE
        html = "<table class='afsprakenTable'>";
        html += "<thead>" +
                "<tr>" +
                    "<th>Klant naam</th>" +
                    "<th>Klant adres</th>" +
                    "<th>Gewenst tijdstip</th>" +
                    "<th>Dichtsbijzijnde halte</th>" +
                    "<th>Afstand halte</th>" +
                    "<th>Reden afspraak</th>" +
                    "<th>Monteur</th>" +
                "</tr>" +
                "</thead>";
        // Loop through array and add table cells
        for (var i=0; i<dataJSON.length; i++) {
            html += "<tr>" + 
                        "<td>" + dataJSON[i].Afspraak.naamKlant + "</td>" + 
                        "<td>" + dataJSON[i].Afspraak.adresKlant + "</td>" + 
                        "<td>" + dataJSON[i].Afspraak.gewenstTijdstip + "</td>" +
                        "<td>" + dataJSON[i].Afspraak.dichtsbijzijndeHalte + "</td>" +
                        "<td>" + dataJSON[i].Afspraak.afstandHalte + "</td>" +
                        "<td>" + dataJSON[i].Afspraak.redenAfspraak + "</td>" +
                        "<td>" + dataJSON[i].Afspraak.naamMonteur + "</td>" +
                    "</tr>";
        }
        html += "</table>";

        // ATTACH HTML TO DIV
        var table = document.getElementsByClassName("afsprakenTable")[0];
        console.log(table);
        if (table != undefined){
            table.parentNode.removeChild(table);
        }
        document.getElementById("data").innerHTML += html;
    });
}

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
var html;
    loadJSONRequest(function (response) {
        // Parse JSON string into object
        var dataJSON = JSON.parse(response);
        for (var i=0;i<dataJSON.length;i++){
            if (dataJSON[i].Afspraak.naamMonteur == input.value){
                found.push(dataJSON[i].Afspraak);
            }
        }
            html = "<table class='afsprakenTable'>";
            html += "<thead>" +
                "<tr>" +
                "<th>Klant naam</th>" +
                "<th>Klant adres</th>" +
                "<th>Gewenst tijdstip</th>" +
                "<th>Dichtsbijzijnde halte</th>" +
                "<th>Afstand halte</th>" +
                "<th>Reden afspraak</th>" +
                "<th>Monteur</th>" +
                "</tr>" +
                "</thead>";
        for (var i=0;i<found.length;i++){
            html += "<tr>" +
                "<td>" + found[i].naamKlant + "</td>" +
                "<td>" + found[i].adresKlant + "</td>" +
                "<td>" + found[i].gewenstTijdstip + "</td>" +
                "<td>" + found[i].dichtsbijzijndeHalte + "</td>" +
                "<td>" + found[i].afstandHalte + "</td>" +
                "<td>" + found[i].redenAfspraak + "</td>" +
                "<td>" + found[i].naamMonteur + "</td>" +
                "</tr>";
        }
        var table = document.getElementsByClassName("afsprakenTable")[0];
        console.log(table);
        if (table != undefined){
            table.parentNode.removeChild(table);
        }
        document.getElementById("data").innerHTML += html;
    });
}