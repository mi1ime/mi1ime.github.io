let movieList = document.querySelector('.movies');
let movies = document.querySelectorAll('.movie');

let loginBtn = document.querySelector('.login');
loginBtn.onclick = () => {
    window.location.href = 'login.html'; 
}

//dates
Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function getDates(startDate, stopDate) {
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
let dateArray = getDates(new Date(), (new Date()).addDays(20));

console.log(dateArray);

let weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

let navSectionsWrap = document.querySelector('.nav-sections');
let datesWrap = navSectionsWrap.querySelector('div');

// format
// let currentSeanceDate = dateArray[0].toISOString().substring(0, 10);
// console.log(currentSeanceDate);

// renderDates(dateArray);
let minIndex = 0;
let maxVisibleDates = 6;
let visibleDates = maxVisibleDates;

let visibleDateArray = dateArray.slice(minIndex, minIndex + visibleDates);
renderDates(visibleDateArray);

let nextArrow = document.querySelector('#next-arrow');
let prevArrow = document.querySelector('#previous-arrow');
nextArrow.onclick = () => {
    datesWrap.innerHTML = '';
    if (minIndex + visibleDates <= dateArray.length - 1) {
        minIndex += 1;
        // if (minIndex > 0) {
        if (minIndex + visibleDates === dateArray.length - 1) {
            visibleDates = maxVisibleDates;
            nextArrow.classList.add('visually-hidden');
        } else {
            visibleDates = maxVisibleDates - 1;
            visibleDateArray = dateArray.slice(minIndex, minIndex + visibleDates);
            if (prevArrow.classList.contains('visually-hidden')) {
                prevArrow.classList.remove('visually-hidden');
            }
        }
        visibleDateArray = dateArray.slice(minIndex, minIndex + visibleDates);
        renderDates(visibleDateArray);
        // }
    }
}

prevArrow.onclick = () => {
    datesWrap.innerHTML = '';
    minIndex -= 1;
    if (dateArray[minIndex] === dateArray[0]) {
        visibleDates = maxVisibleDates;
        prevArrow.classList.add('visually-hidden');
    } else {
        visibleDates = maxVisibleDates - 1;
        visibleDateArray = dateArray.slice(minIndex, minIndex + visibleDates);
        if (nextArrow.classList.contains('visually-hidden')) {
            nextArrow.classList.remove('visually-hidden');
        }
    }
    visibleDateArray = dateArray.slice(minIndex, minIndex + visibleDates);
    renderDates(visibleDateArray);
}

function renderDates(dateArray) {
    dateArray.forEach((date, index) => {
        let weekdayId = date.getUTCDay();
        // if (index <= 5) {
        datesWrap.innerHTML += `<li id="${index}" class="nav-section date">
            <span class="date__day-week">${weekdays[weekdayId]},</span>
            <span class="date__day-number">${date.getDate()}</span>
          </li>`;
    })
    let firstNavDateSection = document.querySelector('.date');
    firstNavDateSection.classList.add('section-selected');

    let navDateSectionsWrap = document.querySelector('.dates_wrap');
    let navDateSections = document.querySelectorAll('.date');
    let selectedDate = document.querySelector('.section-selected');
    let seanceDate;

    findCurrentSeanceDate(selectedDate, seanceDate)

    navDateSections.forEach((section, i) => {
        section.onclick = () => {
            navDateSections.forEach((selectedTab) => {
                if (selectedTab.classList.contains('section-selected')) {
                    selectedTab.classList.remove('section-selected');
                }
            })
            section.classList.add('section-selected');
        }
    })

    navDateSectionsWrap.onclick = () => {
        selectedDate = document.querySelector('.section-selected');
        findCurrentSeanceDate(selectedDate, seanceDate)
    }
}

function findCurrentSeanceDate(selectedDate) {
    visibleDateArray.forEach((visibleDate, index) => {
        if (Number(selectedDate.id) === index) {
            seanceDate = visibleDate;
            console.log(seanceDate)
        }
    })
}

let chosenSeanceId;

fetch('https://shfe-diplom.neto-server.ru/alldata')
    .then(response => response.json())
    .then(data => data.result)
    .then(result => {
        console.log(result);

        halls = result.halls;
        films = result.films;
        seances = result.seances;

        films.forEach((film) => {
            renderFilms(film);
        });

        movies = document.querySelectorAll('.movie');

        movies.forEach((movie) => {
            let filteredByFilms = seances.filter((seance) => seance.seance_filmid === Number(movie.id));

            seances.forEach((seance) => {
                if (seance.seance_filmid === Number(movie.id)) {
                    halls.forEach((hall) => {
                        if (seance.seance_hallid === hall.id && hall.hall_open === 1) {
                            renderHall(movie, seance, hall);
                        }
                    })
                }
            })
        })

        let renderedSeances = document.querySelectorAll('.movie-seance-time');
        renderedSeances.forEach((renderedSeance) => {
            renderedSeance.onclick = function () {
                chosenSeanceId = renderedSeance.id;
                submitValue();
            }
        })
    })

function submitValue() {
    localStorage.setItem('chosenSeanceId', chosenSeanceId);
    localStorage.setItem('seanceDate', seanceDate.toISOString().substring(0, 10));
    window.location.href = 'hall.html';
}

function renderFilms(film) {
    movieList.innerHTML += `<div id="${film.id}" data-seance class="movie">
          <div class="movie-info">
            <img src="${film.film_poster}" alt="Постер к фильму" class="movie-poster"></img>
            <div class="movie-description">
              <h3 class="movie-title">${film.film_name}</h3>
              <p class="movie-synopsis info-text">${film.film_description}</p>
              <span class="movie-duration add-info-text">${film.film_duration} ${numstr(film.film_duration, ['минута', 'минуты', 'минут'])}</span>
              <span class="movie-country add-info-text">${film.film_origin}</span>
            </div>
          </div>`;
}

function renderHall(movie, seance, hall) {
    let counter = 0;
    let renderedHall;
    movie.querySelectorAll('.movie-seances__hall').forEach((el) => {
        if (Number(el.id) === hall.id) {
            counter += 1;
        }
    })
    if (counter === 0) {
        movie.innerHTML += `<div id="${hall.id}" class="movie-seances__hall">
        <h3 class="hall">${hall.hall_name}</h3>
        <ul class="movie-seances"></ul>
        </div>`;
    }
    movie.querySelectorAll('.movie-seances__hall').forEach((el) => {
        if (Number(el.id) === hall.id) {
            renderedHall = el;
        }
    });
    renderSeance(renderedHall, seance)
}

function renderSeance(renderedHall, seance) {
    let renderedHallSeances = renderedHall.querySelector('.movie-seances');
    renderedHallSeances.innerHTML += `<li id="${seance.id}" class="movie-seance-time">${seance.seance_time}</li>`
}

function numstr(n, text_forms) {
    let m = Math.abs(n) % 100;
    let n1 = m % 10;
    if (m > 10 && m < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}