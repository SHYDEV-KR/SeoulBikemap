const stationNoneMsg__from = document.querySelector("#stationNoneMsg__from");
const stationNoneMsg__to = document.querySelector("#stationNoneMsg__to");

let station_markers = [];


function getDistance(a, b) {
    if ((a[0] == b[0]) && (a[1] == b[1]))
        return 0;

    let radLat1 = Math.PI * a[0] / 180;
    let radLat2 = Math.PI * b[0] / 180;
    let theta = a[1] - b[1];
    let radTheta = Math.PI * theta / 180;
    let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1)
        dist = 1;

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
}


function paintStations(event, maxD, target) {

    let station_icon = new kakao.maps.MarkerImage(
        'img/marker-green.png',
        new kakao.maps.Size(25, 40.5),
    );


    let clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 5 // 클러스터 할 최소 지도 레벨 
    });


    fetch('/seoul_public_bike.json')
        .then(response => {
            return response.json();
        })
        .then(publicBike => {
            for (let i = 0; i < Object.keys(publicBike.data).length; i++) {
                let D = getDistance([target.lat, target.lng], [publicBike.data[i].lat, publicBike.data[i].lng])
                
                if (D < maxD * 1000) {
                    station_markers.push(new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(parseFloat(publicBike.data[i].lat), parseFloat(publicBike.data[i].lng)),
                        image: station_icon,
                    }));
                }
            }
            if (Object.keys(station_markers).length == 0) {
                event.path[1].childNodes[3].innerText = `근방 1km에 따릉이가 없습니다.`;
            }
            clusterer.addMarkers(station_markers);
        })
}

paintStationsBtn__from.addEventListener("click", (event) =>
    paintStations(event, 1, fromToXY.from)
);
paintStationsBtn__to.addEventListener("click", (event) =>
    paintStations(event, 1, fromToXY.to)
);