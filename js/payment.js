let chosenSeanceId = Number(localStorage.getItem('chosenSeanceId'));
let places = localStorage.getItem('places');
let totalCost = localStorage.getItem('totalCost');

function numstr(n, text_forms) {
    let m = Math.abs(n) % 100;
    let n1 = m % 10;
    if (m > 10 && m < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}

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

document.getElementById('rub').innerHTML += `<span id="totalCost" class="heading-3">${totalCost}</span> ${numstr(totalCost, ['рубль', 'рубля', 'рублей'])}`;

let btnGetQR = document.querySelector('.get-code');
btnGetQR.onclick = () => {
    window.location.href = 'ticket.html';
}