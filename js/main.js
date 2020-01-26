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
        document.getElementById("data").innerHTML += html;
    });
}

const importJSONButton = document.getElementById('importJSON');

importJSONButton.addEventListener('click', event => {
    getDefaultAfspraken();
});


function CreatePlan() {
    const els = document.getElementById("Createplandiv").getElementsByTagName("input");
console.log(els);
xhr = new XMLHttpRequest();
xhr.open("POST","json/defaultAfspraken.json",true);
xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("ready");
        }
        var data = JSON.stringify({"Id":"99","naamKlant":els[0].value,"adressKlant":els[1].value,"gewenstTijdstip":els[2].value,"dichtbijzijndeHalte":els[3].value,"afstandHalte":els[4].value,"redenAfspraak":els[5].value,"naamMonsteur":els[6].value})

    };
    }
    const createPlanButton = document.getElementById('Createplan');

createPlanButton.addEventListener('click', event => {
    CreatePlan();
});