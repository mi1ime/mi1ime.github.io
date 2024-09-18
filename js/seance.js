fetch('https://shfe-diplom.neto-server.ru/alldata')
    .then(response => response.json())
    .then(data => data.result)
    .then(result => {
        halls = result.halls;
        films = result.films;
        seances = result.seances;

        seances.forEach((seance) => {
            renderSeances(seance);
        })

        let cancelSeances = document.getElementById('cancel-seances-btn');
        cancelSeances.onclick = () => {
            allSeances.forEach((delSeance) => {
                delSeance.remove();
            })
            addedSeances = [];
            deletedSeanceIds = [];
            seances.forEach((seance) => {
                renderSeances(seance);
            })
        }

    })


let filmId;
let hallId;
let popup = document.querySelector('.popup__add-seance');
let hallOption = document.getElementById('halls');
let filmNameOption = document.getElementById('movie-names');
let btnCreateSeance = document.querySelector('.add-movie__add-seance');

let addedSeanceId = -1;
let addedSeances = [];
let deletedSeanceIds = [];

function renderSeances(seance) {
    let timeLines = document.querySelectorAll('.seances-timeline');
    let timelineBarWidth = document.querySelector('.seances-timeline').offsetWidth;
    let seanceDuration;

    let seanceStartTime;

    let minutedSeances = JSON.parse(JSON.stringify(seances));
    for (let i = 0; i < minutedSeances.length; i++) {
        seanceStartTime = minutedSeances[i].seance_time;
        let hours = Number(seanceStartTime.toString().slice(0, 2));
        let hoursInMin = hours * 60;
        let minutes = Number(seanceStartTime.toString().slice(3, 5));
        minutedSeances[i].seance_time = hoursInMin + minutes;
    }

    timeLines.forEach((timeLine) => {
        if (Number(timeLine.id) === seance.seance_hallid) {
            films.forEach((film) => {
                if (seance.seance_filmid === film.id) {
                    let filmName = film.film_name;
                    let filmColor = getComputedStyle(document.getElementById(film.id)).backgroundColor;

                    seanceDuration = film.film_duration;

                    let seanceBarWidth = timelineBarWidth / 1440 * seanceDuration;
                    let seanceBeforeInMin;
                    minutedSeances.forEach((minutedSeance) => {
                        if (minutedSeance.id === seance.id) {
                            seanceBeforeInMin = minutedSeance.seance_time;
                        }
                    })

                    let seanceBefore = timelineBarWidth / 1440 * seanceBeforeInMin - 0.5;

                    timeLine.innerHTML += `<div class="seances-movie" id="${seance.id}" draggable="true" style="background-color: ${filmColor}; width: ${seanceBarWidth}px; margin-left: ${seanceBefore}px">
                        <div class="seances-movie-text">${filmName}</div>
                        <div class="seances-movie-start">${seance.seance_time}</div>
                    </div>`
                }
            })
        }
    })

    //drag and drop
    films.forEach((film) => {
        const sources = document.querySelectorAll(".movie-item");
        for (source of sources) {
            source.addEventListener("dragstart", function (e) {
                films.forEach((film) => {
                    if (Number(e.target.id) === film.id) {
                        e.dataTransfer.setData('film_name', film.film_name);
                        e.dataTransfer.setData('film_duration', film.film_duration);
                        filmId = film.id;
                    }
                })
            })
        }
    })

    halls.forEach((hall) => {
        const dropHalls = document.querySelectorAll(".seances-timeline");

        for (dropHall of dropHalls) {
            dropHall.addEventListener("dragover", function (e) {
                e.preventDefault();
            })

            dropHall.addEventListener("drop", function (e) {
                let film_name = e.dataTransfer.getData('film_name');
                let film_duration = e.dataTransfer.getData('film_duration');

                popup.classList.remove('visually-hidden');

                let hall_name;

                halls.forEach((hall) => {
                    if (Number(e.target.id) === hall.id) {
                        hall_name = hall.hall_name;
                        hallId = hall.id;
                    }

                    hallOption.innerHTML = `<option>${hall_name}</option>`;
                })

                filmNameOption.innerHTML = `<option>${film_name}</option>`;

                btnCreateSeance.onclick = function () {
                    seanceTime = document.querySelector('#movie-start-time').value;

                    timeLines.forEach((timeline) => {
                        if (Number(timeline.id) === hallId) {
                            addedSeanceId -= 1;
                            console.log(hall.id)

                            let filmColor = getComputedStyle(document.getElementById(filmId)).backgroundColor;

                            let hours = Number(seanceTime.toString().slice(0, 2));
                            let hoursInMin = hours * 60;
                            let minutes = Number(seanceTime.toString().slice(3, 5));
                            let minutedAddedSeance = hoursInMin + minutes;

                            let seanceBarWidth = timelineBarWidth / 1440 * film_duration;

                            let seanceBefore = timelineBarWidth / 1440 * minutedAddedSeance - 0.5;

                            timeline.innerHTML += `<div class="seances-movie" id="${addedSeanceId}" draggable="true" style="background-color: ${filmColor}; width: ${seanceBarWidth}px; margin-left: ${seanceBefore}px">
                                <div class="seances-movie-text">${film_name}</div>
                                <div class="seances-movie-start">${seanceTime}</div>
                            </div>`

                            addedSeances.push({ 'id': addedSeanceId, 'seance_hallid': hallId, 'seance_filmid': filmId, 'seance_time': seanceTime });
                        }
                    })

                    popup.classList.add('visually-hidden');

                    renderSeances(addedSeances);
                }

            })
        }
    })

    let allSeances = document.querySelectorAll('.seances-movie');
    let trashcans = document.querySelectorAll('.seance-trashcan');
    allSeances.forEach((delSeance) => {
        let visibleTrashcan;

        delSeance.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData('delSeanceId', delSeance.id);
            e.dataTransfer.setData('delSeanceFilm', delSeance.querySelector('.seances-movie-text').innerHTML);
            trashcans.forEach((trashcan) => {
                if (trashcan.id === delSeance.parentElement.id) {
                    trashcan.classList.remove('visually-hidden');
                    visibleTrashcan = trashcan;
                }
            })
        })

        delSeance.addEventListener("dragend", function (e) {
            if (visibleTrashcan) {
                visibleTrashcan.classList.add('visually-hidden')
            }
        })

        let delSeanceId;
        let delSeanceFilm;

        trashcans.forEach((trashcan) => {
            trashcan.addEventListener("dragover", function (e) {
                e.preventDefault();
            })

            trashcan.addEventListener("drop", function (e) {
                delSeanceId = Number(e.dataTransfer.getData('delSeanceId'));
                delSeanceFilm = e.dataTransfer.getData('delSeanceFilm');

                trashcan.classList.add('visually-hidden');

                deleteSeanceFilmTitle.innerHTML = `${delSeanceFilm}`;

                popupDeleteSeance.classList.remove('visually-hidden');

                btnDeleteSeance.onclick = function () {
                    deleteSeance(delSeanceId);
                    popupDeleteSeance.classList.add('visually-hidden');
                    deleteSeanceFilmTitle.innerHTML = "";
                }
            })
        })

    })


}


let btnSaveSeance = document.querySelector('#save-seances-btn');
btnSaveSeance.onclick = function () {
    addedSeances.forEach((seance) => {
        const seanceParams = new FormData();
        seanceParams.set('seanceHallid', seance.seance_hallid);
        seanceParams.set('seanceFilmid', seance.seance_filmid);
        seanceParams.set('seanceTime', seance.seance_time);

        fetch('https://shfe-diplom.neto-server.ru/seance', {
            method: 'POST',
            body: seanceParams
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    console.log(data);
                } else {
                    let hallNames = document.querySelectorAll('.seances-timeline-hall');
                    let hallName;
                    hallNames.forEach((hallNameError) => {
                        if (Number(hallNameError.id) === seance.seance_hallid) {
                            hallName = hallNameError.innerHTML;
                        }
                        return;
                    })

                    allSeances = document.querySelectorAll('.seances-movie');
                    let filmName;
                    allSeances.forEach((seanceError) => {
                        if (Number(seanceError.id) === seance.id) {
                            filmName = seanceError.querySelector('.seances-movie-text').innerHTML;
                        }
                        return;
                    })
                    if (data.error === 'Сеанс пересекается по времени с другими сеансами') {
                        alert(`Сеанс в зале ${hallName} на ${seance.seance_time} на фильм "${filmName}" пересекается с другими сеансами и будет удален.`);
                    } else {
                        alert(data.error);
                    }
                    deleteSeance(seance.id);
                }
            });
    })

    deletedSeanceIds.forEach((seanceId) => {
        fetch(`https://shfe-diplom.neto-server.ru/seance/${Number(seanceId)}`, {
            method: 'DELETE',

        }).then(response => response.json())
            .then(data => data.result)
            .then(result => {
                console.log(result)
            })
    })
}

function deleteSeance(delSeanceId) {
    allSeances = document.querySelectorAll('.seances-movie');

    allSeances.forEach((delSeance) => {
        if (Number(delSeance.id) === delSeanceId) {
            delSeance.remove();
            deletedSeanceIds.push(delSeance.id);
            return;
        }
    });

    deletedSeanceIds.forEach((delSeance, index) => {
        if (Number(delSeance) === delSeanceId) {
            for (let i = 0; i < addedSeances.length; i++) {
                if (Number(delSeance) === addedSeances[i].id) {
                    addedSeances.splice(i, 1);
                    deletedSeanceIds.splice(index, 1);
                    break;
                }
            }
            return;
        }

    })
}








popupXAddSeance = document.querySelector('.popup-x__add-seance');
cancelPopupAddSeance = document.querySelector('.cancel-popup__add-seance');
hidePopupAddSeance = [popupXAddSeance, cancelPopupAddSeance]
btnAddSeance = document.querySelector('.add-movie__add-seance');
popupAddSeance = document.querySelector('.popup__add-seance');
hidePopupAddSeance.forEach((elem) => {
    elem.onclick = function (event) {
        popupAddSeance.classList.add('visually-hidden');
    };
});

popupXDeleteSeance = document.querySelector('.popup-x__delete-seance');
cancelPopupDeleteSeance = document.querySelector('.cancel-popup__delete-seance');
hidePopupDeleteSeance = [popupXDeleteSeance, cancelPopupDeleteSeance]
btnDeleteSeance = document.querySelector('.delete-seance');
popupDeleteSeance = document.querySelector('.popup__delete-seance');
hidePopupDeleteSeance.forEach((elem) => {
    elem.onclick = function (event) {
        popupDeleteSeance.classList.add('visually-hidden');
    };
});
deleteSeanceFilmTitle = document.querySelector('.delete-seance__film-title');