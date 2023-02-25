
/**
 * Funciones generales
*/
function cleanList(list) {
    if (!list)
        return;
    if (!list.firstChild)
        return;

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function addLiToUl(lista, texto, valor) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(texto+valor));
    lista.appendChild(li);
}

function formatNumber(number) {
    return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2}).format(number);
}

document.getElementById('tokenButton').addEventListener('click', (_event) => {
    var myHeaders = new Headers();
    myHeaders.append("Origin", "https://play.realmnft.io");
    myHeaders.append("PlayerToken", document.getElementById("tokenInput").value);
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Host", "realmserver.azurewebsites.net");
    myHeaders.append("PlayerID", "7148");
    myHeaders.append("Referer", "https://play.realmnft.io/");
    myHeaders.append("ClientVersion", "7.0.0");
    myHeaders.append("Cookie", "ARRAffinity=9d7c7f91697d0127cf62a671604c0105a87a17711ef5caf56fe8a4941fca5dbf; ARRAffinitySameSite=9d7c7f91697d0127cf62a671604c0105a87a17711ef5caf56fe8a4941fca5dbf");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://realmserver.azurewebsites.net/api/Login/PlayerData", requestOptions)
    .then(response => response.text())
    .then(result => buildPage(JSON.parse(result)))
    .catch(error => console.log('error', error));
    
});  

function buildTransports(transports) {
    const listaCamiones = document.getElementById("listaCamiones");
    cleanList(listaCamiones);
    const listaAviones = document.getElementById("listaAviones");
    cleanList(listaAviones);
    const listaBarcos = document.getElementById("listaBarcos");
    cleanList(listaBarcos);
    
    transports.forEach(transporte => {
        switch(transporte.TransportID) {
            case 3:
                addLiToUl(listaCamiones, "Level Camion: ", transporte.Level);
                break;
            case 2:
                addLiToUl(listaAviones, "Level Avion: ", transporte.Level);
                break;
            case 1:
                addLiToUl(listaBarcos, "Level Barco: ", transporte.Level);
                break;
        }
    });
}


function buildEdificios(edificios) {
    const listaAlmacenes = document.getElementById("listaAlmacenes");
    cleanList(listaAlmacenes);
    const listaFabricas = document.getElementById("listaFabricas");
    cleanList(listaFabricas);
    edificios.forEach(edificio => {
        switch(edificio.BuildingID) {
            case 2:
                addLiToUl(listaAlmacenes, "Level Almacen: ", edificio.Level);
                break;
            case 3:
                addLiToUl(listaFabricas, "Level Fabricas: ", edificio.Level);
                break;
        }
    });
}

function buildRecursosPorMinutos(personaje, transportes) {
    const recursosPorMinuto = document.getElementById("recursosPorMinutos");
    let sumaTotal = personaje.ResourcesPerMinute;
    transportes.forEach(transporte => {
        if (transporte.TransportID === 3) {
            sumaTotal += transporte.CollectionRate;
        }
    });
    recursosPorMinuto.innerHTML = "Recursos por minuto: [" + formatNumber(sumaTotal) + "]";
}

function buildTotalTitanium(personaje) {
    const totalTitanium = document.getElementById("titanium");
    totalTitanium.innerHTML = "Titanium Total: [" + formatNumber(personaje.Titanium) + "]";
}

function buildTotalRlm(personaje) {
    const totalTitanium = document.getElementById("RLM");
    totalTitanium.innerHTML = "Total RLM: [" + formatNumber(personaje.Tokens) + "]";
}

function buildLimiteAlmacen(personaje) {
    const totalTitanium = document.getElementById("LimiteDeAlmacen");
    totalTitanium.innerHTML = "Total Almacen: [" + formatNumber(personaje.ResourceLimit) + "]";
}

function buildMainInfo(personaje, transportes) {
    
    buildLimiteAlmacen(personaje)
    buildRecursosPorMinutos(personaje, transportes);
    buildTotalRlm(personaje);
    buildTotalTitanium(personaje);
}

function buildPage(data) {
    buildTransports(data.PlayerTransports);
    buildEdificios(data.PlayerBuildings);    
    buildMainInfo(data.PlayerState, data.PlayerTransports)
}