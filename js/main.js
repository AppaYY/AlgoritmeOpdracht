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
                    "<th>Klant naam<div id='sort'><p> sort</p></div></th>" +
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

const sortButton = document.getElementById('sort');

sortButton.addEventListener('click', event => {
    sortDefaultAfspraken();

});
function sortDefaultAfspraken(){
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

        function quick_Sort(array) {

        }



        console.log("Original array: " + dataJSON);
        var sortedArray = quick_Sort(dataJSON);
        console.log("Sorted array: " + sortedArray);


    });
}