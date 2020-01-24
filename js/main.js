function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/defaultAfspraken.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init() {
    loadJSON(function (response) {
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
        document.getElementById("data").innerHTML = html;
    });
}

init();