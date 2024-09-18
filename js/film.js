fetch('https://shfe-diplom.neto-server.ru/alldata')
    .then(response => response.json())
    .then(data => data.result)
    .then(result => {

        films = result.films;
        seances = result.seance;
        let filmId;

        films.forEach((film) => {
            renderFilms(film);

            let movieItems = document.querySelectorAll('.movie-item');
            movieItems.forEach((movie, index) => {
                let trashcan = movie.querySelector('.movie-trashcan');
                trashcan.onclick = function () {
                    deleteFilm(trashcan.id)
                }
            })

        })


    })


function numstr(n, text_forms) {
    let m = Math.abs(n) % 100;
    let n1 = m % 10;
    if (m > 10 && m < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}

let movieList = document.querySelector('.movie-list');

function renderFilms(film) {
    movieList.innerHTML += `<div class="movie-item" id="${film.id}" draggable="true">
    <img src="${film.film_poster}" alt="Постер к фильму" class="movie-poster">
    <div class="movie-item-content">
      <span class="movie-name">${film.film_name}</span>
      <span class="movie-duration">
      ${film.film_duration}
      ${numstr(film.film_duration, ['минута', 'минуты', 'минут'])}
      </span>
    </div>
    <button class="trashcan movie-trashcan" id="${film.id}"></button>
  </div>`;

    colorFilms();
}

function colorFilms() {
    movieItems = document.querySelectorAll('.movie-item');
    let movieItemCount = 0;
    const colors = ['#CAFF85', '#85FF89', '#85FFD3', '#85E2FF', '#8599FF'];
    movieItems.forEach((movieItem) => {
        movieItem.style.backgroundColor = colors[movieItemCount % 5];
        movieItemCount++;
    });
}

function deleteFilm(trashcan_id) {
    fetch(`https://shfe-diplom.neto-server.ru/film/${trashcan_id}`, {
        method: 'DELETE',
    })
        .then(() => {
            fetch('https://shfe-diplom.neto-server.ru/alldata')
                .then(response => response.json())
                .then(data => data.result)
                .then(result => {
                    films = result.films;
                    seances = result.seances;

                    movieList.innerHTML = '';
                    films.forEach((film) => {
                        renderFilms(film);
                    })

                    seancesHalls = document.querySelectorAll('.timeline__wrapper');
                    seancesHalls.forEach((hall) => {
                        let timeline = hall.querySelector('.seances-timeline');
                        timeline.innerHTML = '';
                    });

                    seances.forEach((seance) => {
                        renderSeances(seance);
                    })
                });
        })


}

let popupXAddMovie = document.querySelector('.popup-x__add-movie');
let cancelPopupAddMovie = document.querySelector('.cancel-popup__add-movie');
let hidePopupAddMovie = [popupXAddMovie, cancelPopupAddMovie]
let popupAddMovie = document.querySelector('.popup__add-movie');

let btnAddMovie = document.querySelector('.btn-add-movie');
btnAddMovie.onclick = function (event) {
    popupAddMovie.classList.remove('visually-hidden');
};
hidePopupAddMovie.forEach((elem) => {
    elem.onclick = function (event) {
        popupAddMovie.classList.add('visually-hidden');
    };
});

let uploadPoster = document.querySelector('#upload-poster');
uploadPoster.addEventListener("change", function () {
    if (uploadPoster.files.length > 0) {
        const fileSize = uploadPoster.files[0].size;
        if (fileSize > 3145728) {
            alert("Размер файла не должен превышать 3Mb.");
            btnCreateMovie.disabled = true;
            btnCreateMovie.classList.remove('pointer')
        } else {
            btnCreateMovie.disabled = false;
            btnCreateMovie.classList.add('pointer')
        }
    }
});

let btnCreateMovie = document.querySelector('.create-movie');
btnCreateMovie.onclick = function () {
    movieNameValue = document.querySelector('#movie-name').value;
    movieDurationValue = document.querySelector('#movie-duration').value;
    movieDescriptionValue = document.querySelector('#movie-synopsis').value;
    movieOriginValue = document.querySelector('#movie-country').value;


    const filmParams = new FormData();
    filmParams.set('filmName', movieNameValue);
    filmParams.set('filmDuration', movieDurationValue);
    filmParams.set('filmDescription', movieDescriptionValue);
    filmParams.set('filmOrigin', movieOriginValue);
    if (uploadPoster.files.length > 0) {
        let file = uploadPoster.files[0];
        filmParams.set('filePoster', file, file.name);
    }

    fetch('https://shfe-diplom.neto-server.ru/film', {
        method: 'POST',
        body: filmParams
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                fetch('https://shfe-diplom.neto-server.ru/alldata')
                    .then(response => response.json())
                    .then(data => data.result)
                    .then(result => {
                        films = result.films;
                        seances = result.seances;

                        movieList.innerHTML = '';
                        films.forEach((film) => {
                            renderFilms(film);
                        })
                    })
            } else {
                alert(data.error)
            }
        });
}