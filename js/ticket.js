let chosenSeanceId = Number(localStorage.getItem('chosenSeanceId'));
let places = localStorage.getItem('places');
// let totalCost = localStorage.getItem('totalCost');

document.getElementById('qrcode').append(QRCreator('1').result);

fetch('https://shfe-diplom.neto-server.ru/alldata')
    .then(response => response.json())
    .then(data => data.result)
    .then(result => {
        console.log(result);

        halls = result.halls;
        films = result.films;
        seances = result.seances;

        seances.forEach((seance) => {
            if (chosenSeanceId === seance.id) {
                document.getElementById('seanceTime').innerHTML = seance.seance_time;
                films.forEach((film) => {
                    if (film.id === seance.seance_filmid) {
                        document.getElementById('movieTitle').innerHTML = film.film_name
                    }
                })
                halls.forEach((hall) => {
                    if (hall.id === seance.seance_hallid) {
                        document.getElementById('hallName').innerHTML = hall.hall_name
                    }
                })
            }
        });
    })

document.getElementById('places').innerHTML += places.split(',').join(', ')