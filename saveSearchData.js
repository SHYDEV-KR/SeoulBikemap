const fromForm = document.querySelector("#fromForm");
const toForm = document.querySelector("#toForm");
const fromInput = document.querySelector("#fromForm > input");
const toInput = document.querySelector("#toForm > input");
const searchResults = document.querySelector("#searchResults");

let places = new kakao.maps.services.Places();

let fromToXY = {
    "from": {
        "name" : null,
        "id" : null,
        "x": null,
        "y": null,
    },
    "to": {
        "name" : null,
        "id" : null,
        "x": null,
        "y": null,
    }
}

function saveLocations(type) {
    if (type == "from") localStorage.setItem("from", JSON.stringify(fromToXY.from));
    else if (type == "to") localStorage.setItem("to", JSON.stringify(fromToXY.to));
}

let showPlaces = function (result, status, type) {
    if (status === kakao.maps.services.Status.OK) {
        for (i = 0; i < Object.keys(result).length; i++) {
            let placeName = result[i].place_name;
            let placeId = result[i].id;
            let x = result[i].x;
            let y = result[i].y;
            paintSearchResults(placeName, placeId);
            document.querySelector(`.result-${placeId}`).addEventListener('click', () => {
                searchResults.innerHTML = '';

                if (type == "from") {
                    fromInput.value = `${placeName}`;
                    fromToXY.from.name = placeName;
                    fromToXY.from.id = placeId;
                    fromToXY.from.x = x;
                    fromToXY.from.y = y;
                } else {
                    toInput.value = `${placeName}`;
                    fromToXY.to.name = placeName;
                    fromToXY.to.id = placeId;
                    fromToXY.to.x = x;
                    fromToXY.to.y = y;
                }
                saveLocations(type);
            }
            );
        }
        saveLocations();
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


fromForm.addEventListener("submit", (event) =>
    handleInput(event, "from"));
toForm.addEventListener("submit", (event) =>
    handleInput(event, "to"));

const savedFrom = localStorage.getItem("from");
const savedTo = localStorage.getItem("to");

if (savedFrom !== null) {
    fromToXY.from = JSON.parse(savedFrom);
    fromInput.value = `${fromToXY.from.name}`;
} else {
    fromInput.value = ``;
}

if (savedTo !== null) {
    fromToXY.to = JSON.parse(savedTo);
    toInput.value = `${fromToXY.to.name}`;
} else {
    toInput.value = ``;
}