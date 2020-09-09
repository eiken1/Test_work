let map;

function initMap () {
    console.log("Map here");
    let startPoint = {lat: 59.918691, lng: 10.748877};

    map = new google.maps.Map(document.querySelector("#mapContainer"), {
        zoom: 17, 
        center: startPoint
    });

    let marker = new google.maps.Marker({position: startPoint, map: map});
}

const mainAPI = "https://gbfs.urbansharing.com/oslobysykkel.no/gbfs.json";

const options = {
    method: "GET",
    headers: {'Client-Identifier': 'BysykkelAPI-test'},
    json: true
};

async function fetchData (url, options) {
    return await fetch(url, options)
    .then(res => res.json())
    .then(data => {
        return data;
    });
}

async function getBikeData () {
    let bikeData = {
        lastUpdated: 0,
        ttl: 0,
        systemInformation: [],
        stationInformation: [],
        stationStatus: [],
    };
    let mainData = await fetchData(mainAPI, options);
    bikeData.lastUpdated = mainData.last_updated;
    bikeData.ttl = mainData.ttl;
    let feeds = mainData.data.nb.feeds;
    bikeData.systemInformation = await fetchData(feeds.find(feed => feed.name === "system_information").url,options);
    bikeData.stationInformation = await fetchData(feeds.find(feed => feed.name === "station_information").url,options);
    bikeData.stationStatus = await fetchData(feeds.find(feed => feed.name === "station_status").url,options)
    
    return bikeData;
}

async function populateBikeTables () {
    let bikeData = await getBikeData();

    let originDiv = document.querySelector("#tableContainer");

    const headers = ["ID", "Stasjon", "Kapasitet", "Sykler ledig", "Plasser ledig"];

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");

    headers.forEach(head => {
        let headerCell = document.createElement("th");
        headerCell.textContent = head;

        headerRow.appendChild(headerCell);
    });
    

    originDiv.appendChild(table);
    table.appendChild(headerRow);

    bikeData.stationInformation.data.stations.forEach(station => {
        let stationStatus = bikeData.stationStatus.data.stations.find(status => status.station_id === station.station_id);

        let tableRow = document.createElement("tr");
        let stationCell = document.createElement("td");
        let idCell = document.createElement("td");
        let capacityCell = document.createElement("td");
        let numBikesCell = document.createElement("td");
        let numDocksCell = document.createElement("td");

        idCell.textContent = station.station_id;
        stationCell.textContent = station.name;
        capacityCell.textContent = station.capacity;
        numBikesCell.textContent = stationStatus.num_bikes_available;
        numDocksCell.textContent = stationStatus.num_docks_available;

        tableRow.appendChild(idCell);
        tableRow.appendChild(stationCell);
        tableRow.appendChild(capacityCell);
        tableRow.appendChild(numBikesCell);
        tableRow.appendChild(numDocksCell);
        table.appendChild(tableRow);

        let markerPos = {lat: station.lat, lng: station.lon};

        let marker = new google.maps.Marker({position: markerPos, map: map});

        tableRow.addEventListener("click", function () {
            map.setCenter(markerPos);
        })
    });
}


populateBikeTables();