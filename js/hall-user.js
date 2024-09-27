let seatsEl = document.getElementById('seats');
let renderedSeats;

let hallName = document.getElementById('hall-name');
let movieTitle = document.querySelector('.movie-title');
let seanceStartTime = document.getElementById('seance-start-time');

let chosenSeanceId = localStorage.getItem('chosenSeanceId');
let seanceDate = localStorage.getItem('seanceDate');

fetch('https://shfe-diplom.neto-server.ru/alldata')
  .then(response => response.json())
  .then(data => data.result)
  .then(result => {
    console.log(result);
    halls = result.halls;
    seances = result.seances;
    films = result.films;

    seances.forEach((seance) => {
      if (Number(chosenSeanceId) === seance.id) {
        films.forEach((film) => {
          if (film.id === seance.seance_filmid) {
            movieTitle.innerHTML += film.film_name;
          }
        })

        halls.forEach((hall) => {
          if (hall.id === seance.seance_hallid) {
            hallName.innerHTML += hall.hall_name;
          }
        })

        seanceStartTime.innerHTML += seance.seance_time;
      }
    })

    fetch( `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${chosenSeanceId}&date=${seanceDate}` )
    .then( response => response.json())
    .then( data => {renderSeats(data.result)});

    halls.forEach((hall) => {

      if (hallName.innerHTML === hall.hall_name) {

        let standartPriceValue = document.getElementById('standart-price');
        let vipPriceValue = document.getElementById('vip-price');
        standartPriceValue.innerHTML = hall.hall_price_standart;
        vipPriceValue.innerHTML = hall.hall_price_vip;

        let book = document.querySelector('.book');
        let tickets = [];
        let places = [];
        let totalCost = 0;
        book.onclick = function () {
          renderedSeats.forEach((seat) => {
            let ticket = {};
            if (seat.classList.contains('chair_selected')) {
              ticket.row = Number(seat.dataset.row) + 1;
              ticket.place = Number(seat.dataset.col) + 1;
              if (hall.hall_config[seat.dataset.row][seat.dataset.col] === 'vip') {
                ticket.coast = hall.hall_price_vip;
              } else if (hall.hall_config[seat.dataset.row][seat.dataset.col] === 'standart') {
                ticket.coast = hall.hall_price_standart;
              }

              seat.classList.remove('chair_selected');
              seat.classList.add('chair_taken');
              hall.hall_config[seat.dataset.row][seat.dataset.col] = 'taken';
              tickets.push(ticket);

              places.push(ticket.place);
              localStorage.setItem('places', places);
            }
          })
          tickets.forEach((ticket) => {
            totalCost += ticket.coast;
          })
          localStorage.setItem('totalCost', totalCost);

          console.log(tickets);

          const params = new FormData();
          params.set('seanceId', Number(chosenSeanceId));
          params.set('ticketDate', seanceDate);
          params.set('tickets', JSON.stringify(tickets));
          fetch('https://shfe-diplom.neto-server.ru/ticket', {
            method: 'POST',
            body: params
          })
            .then(response => response.json())
            .then(data => {
              if (data.success === true) {
                let toBeCodedTickets = data.result;
                let codedRow = 0;
                let codedPlace = 0;
                let codedRowsPlaces = [];
                for (i = 0; i < toBeCodedTickets.length; i++) {
                  codedRow = toBeCodedTickets[i].ticket_row;
                  codedPlace = toBeCodedTickets[i].ticket_place;
                  codedRowsPlaces.push(`${codedRow}/${codedPlace}`);
                }

                let codedTicket = `Фильм: ${movieTitle.innerHTML}
Дата: ${seanceDate.split('-').reverse().join('.')}
Время: ${seanceStartTime.innerHTML}
Ряд/Место: ${codedRowsPlaces.join(', ')}`;
                
                localStorage.setItem('codedTicket', codedTicket);

                window.location.href = 'payment.html';

              } else {
                console.log(data);
              }
            })

        };
      }
    })
  })

function renderSeats(seats) {
  const fields = [];
  for (let [i, row] of seats.entries()) {
    for (let [j, value] of row.entries()) {
      if (seats[i][j] === 'vip') {
        fields.push(`<div class="field eg-chair-style chair_vip" 
              data-row="${i}" 
              data-col="${j}"
              style="grid-row:${i + 1};grid-column:${j + 1};"
          ></div>`);
      } else if (seats[i][j] === 'standart') {
        fields.push(`<div class="field eg-chair-style chair_normal" 
              data-row="${i}" 
              data-col="${j}"
              style="grid-row:${i + 1};grid-column:${j + 1};"
          ></div>`);
      }
      else if (seats[i][j] === 'disabled') {
        fields.push(`<div class="field eg-chair-style chair_disabled" 
              data-row="${i}" 
              data-col="${j}"
              style="grid-row:${i + 1};grid-column:${j + 1};"
          ></div>`);
      } else {
        fields.push(`<div class="field eg-chair-style chair_taken" 
            data-row="${i}" 
            data-col="${j}"
            style="grid-row:${i + 1};grid-column:${j + 1};"
        ></div>`);
      }
    }
  }
  seatsEl.innerHTML = fields.join('');

  renderedSeats = document.querySelectorAll('.field');
  renderedSeats.forEach((seat) => {
    if (!seat.classList.contains('chair_disabled') && !seat.classList.contains('chair_taken')) {
      seat.onclick = function (event) {
        if (seat.classList.contains('chair_selected')) {
          seat.classList.remove('chair_selected');
        } else {
          seat.classList.add('chair_selected');
        }
      };
    }
  })

}