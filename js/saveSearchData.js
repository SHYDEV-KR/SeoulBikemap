const fromForm = document.querySelector("#fromForm");
const toForm = document.querySelector("#toForm");
const fromInput = document.querySelector("#fromForm > input");
const toInput = document.querySelector("#toForm > input");
const searchResults = document.querySelector("#searchResults");

const stations__from = document.querySelector("#stations__from");
const stations__to = document.querySelector("#stations__to");

let places = new kakao.maps.services.Places();

let fromToXY = {};

let showPlaces = function (result, status, type) {
    if (status === kakao.maps.services.Status.OK) {
        for (i = 0; i < Object.keys(result).length; i++) {
            let placeName = result[i].place_name;
            let placeId = result[i].id;
            let lng = result[i].x;
            let lat = result[i].y;
            paintSearchResults(placeName, placeId);
            document.querySelector(`.result-${placeId}`).addEventListener('click', () => {
                searchResults.innerHTML = '';

                if (type == "from") {
                    fromInput.value = `${placeName}`;
                    fromToXY.from.name = placeName;
                    fromToXY.from.id = placeId;
                    fromToXY.from.lng = lng;
                    fromToXY.from.lat = lat;
                    stations__from.classList.remove('hidden');
                    if (fromToXY.from.marker) {
                        fromToXY.from.marker.setMap(null);
                        fromToXY.from.marker = null;
                    }
                    paintMarker(lat, lng, "from");
                    localStorage.setItem("from", JSON.stringify({
                        name: placeName,
                        lat: lat,
                        lng: lng,
                        id: placeId,
                    }));
                } else {
                    toInput.value = `${placeName}`;
                    fromToXY.to.name = placeName;
                    fromToXY.to.id = placeId;
                    fromToXY.to.lng = lng;
                    fromToXY.to.lat = lat;
                    stations__to.classList.remove('hidden');
                    if (fromToXY.to.marker) {
                        fromToXY.to.marker.setMap(null);
                        fromToXY.to.marker = null;
                    }
                    paintMarker(lat, lng, "to");
                    localStorage.setItem("to", JSON.stringify({
                        name: placeName,
                        lat: lat,
                        lng: lng,
                        id: placeId,
                    }));
                }
            }
            );
        }
        
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        searchResults.innerText = "검색결과가 없습니다."
    } else {
        searchResults.innerText = "에러가 발생했습니다."
    }
};


function handleInput(event, type) {
    searchResults.innerHTML = '';

    event.preventDefault();
    const keyword = event.path[0][0].value;
    //event.path[0][0].value = "";

    places.keywordSearch(keyword, (result, status) =>
        showPlaces(result, status, type)
    );
}


function paintSearchResults(placename, id) {
    let place = document.createElement('div');
    place.innerText = `${placename}`;
    place.classList.add(`result-${id}`);
    searchResults.append(place);
}

function paintMarker(lat, lng, type) {
    if (type == "from") {
        fromToXY.from.marker =
            new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lng)
            });
    } else {
        fromToXY.to.marker =
            new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lng)
            });
    }
}


fromForm.addEventListener("submit", (event) =>
    handleInput(event, "from"));
toForm.addEventListener("submit", (event) =>
    handleInput(event, "to"));

const savedFrom = localStorage.getItem("from");
const savedTo = localStorage.getItem("to");

if (savedFrom !== null) {
    fromToXY.from = JSON.parse(savedFrom);
    fromInput.value = `${fromToXY.from.name}`;
    stations__from.classList.remove('hidden');
    paintMarker(fromToXY.from.lat, fromToXY.from.lng, "from");
} else {
    fromInput.value = ``;
    stations__from.classList.add('hidden');
}

if (savedTo !== null) {
    fromToXY.to = JSON.parse(savedTo);
    toInput.value = `${fromToXY.to.name}`;
    stations__to.classList.remove('hidden');
    paintMarker(fromToXY.to.lat, fromToXY.to.lng, "to");
} else {
    toInput.value = ``;
    stations__to.classList.add('hidden');
}