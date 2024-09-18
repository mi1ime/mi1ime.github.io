let hallList = document.querySelector('.ul-hall');
let priceConfigSelectors_Wrap = document.querySelector('.price-config-selectors');
let openHallSelectors_Wrap = document.querySelector('.open-hall-selectors');
let seancesTimeline = document.querySelector('.seances-timeline__wrapper');

let hallConfigSelectors_Wrap = document.querySelector('.hall-config-selectors');
let hallSelectors = Array.from(hallConfigSelectors_Wrap.querySelectorAll('.selector'));

let standart = document.querySelector('#price');
let vip = document.querySelector('#vip-price');

let ready = document.querySelector('.ready');

fetch('https://shfe-diplom.neto-server.ru/alldata')
    .then(response => response.json())
    .then(data => data.result)
    .then(result => {
        console.log(result);
        halls = result.halls;
        seances = result.seances;

        halls.forEach((hall) => {
            renderHalls(hall);
        })

        //seats
        let rows = document.querySelector('#rows');
        let places = document.querySelector('#places');
        rows.addEventListener("change", function () {
            createSeats(rows.value, places.value)
        })
        places.addEventListener("change", function () {
            createSeats(rows.value, places.value)
        })

        //add hall

        let popupXAddHall = document.querySelector('.popup-x__add-hall');
        let cancelPopupAddHall = document.querySelector('.cancel-popup__add-hall');
        let hidePopupAddHall = [popupXAddHall, cancelPopupAddHall]
        let popupAddHall = document.querySelector('.popup__add-hall');
        let btnCreateHall = document.querySelector('.create-hall');
        btnCreateHall.onclick = function (event) {
            popupAddHall.classList.remove('visually-hidden');
        };
        hidePopupAddHall.forEach((elem) => {
            elem.onclick = function (event) {
                popupAddHall.classList.add('visually-hidden');
            };
        });

        let btnAddHall = document.querySelector('.add-hall');
        btnAddHall.onclick = function () {
            popupAddHall.classList.add('visually-hidden');

            hallNameValue = document.querySelector('#hall-name').value;

            const params = new FormData();
            params.set('hallName', hallNameValue);
            fetch('https://shfe-diplom.neto-server.ru/hall', {
                method: 'POST',
                body: params
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === true) {
                        fetch('https://shfe-diplom.neto-server.ru/alldata')
                            .then(response => response.json())
                            .then(data => data.result)
                            .then(result => {
                                halls = result.halls;

                                hallList.innerHTML = '';
                                hallConfigSelectors_Wrap.innerHTML = '';
                                priceConfigSelectors_Wrap.innerHTML = '';
                                openHallSelectors_Wrap.innerHTML = '';
                                seancesTimeline.innerHTML = '';

                                halls.forEach((hall) => {
                                    renderHalls(hall);
                                })
                                seances.forEach((seance) => {
                                    renderSeances(seance);
                                })

                            })
                    } else {
                        alert(data.error)
                    }
                });
        }
    })

let currentConfigHallId = -2;

function renderHalls(hall) {

    hallList.innerHTML += `<li id="${hall.id}" class="li-hall">
        ${hall.hall_name}
        <button id="${hall.id}" class="trashcan hall-trashcan"></button>
        </li>`;


    hallConfigSelectors_Wrap.innerHTML += `<li id="${hall.id}" class="selector hall-config-selector">${hall.hall_name}</li>`;
    priceConfigSelectors_Wrap.innerHTML += `<li id="${hall.id}" class="selector price-config-selector">${hall.hall_name}</li>`;
    openHallSelectors_Wrap.innerHTML += `<li id="${hall.id}" class="selector open-hall-selector">${hall.hall_name}</li>`;

    seancesTimeline.innerHTML += `<div class="timeline__wrapper">
            <h3 id="${hall.id}" class="seances-timeline-hall">${hall.hall_name}</h3>
            <button id="${hall.id}" class="seance-trashcan visually-hidden"></button>
            <div id="${hall.id}" class="seances-timeline">
            </div>
        </div>`;

    //listeners

    let hallsLi = document.querySelectorAll('.li-hall');
    hallsLi.forEach((hallLi, index) => {
        let trashcan = hallLi.querySelector('.hall-trashcan');
        trashcan.onclick = function () {
            deleteHall(trashcan.id)
        }
    })

    hallList = document.querySelector('.ul-hall');

    priceConfigSelectors_Wrap = document.querySelector('.price-config-selectors');
    priceConfigSelectors = Array.from(priceConfigSelectors_Wrap.querySelectorAll('.selector'));
    openHallSelectors_Wrap = document.querySelector('.open-hall-selectors');
    openHallSelectors = Array.from(openHallSelectors_Wrap.querySelectorAll('.selector'));
    seancesTimeline = document.querySelector('.seances-timeline__wrapper');

    hallConfigSelectorsWrap = document.querySelector('.hall-config-selectors');
    hallSelectors = Array.from(hallConfigSelectors_Wrap.querySelectorAll('.selector'));

    hallSelectors.forEach((selector, i) => {
        selector.onclick = () => {
            hallSelectors.forEach((selectedTab, i) => {
                if (selectedTab.classList.contains('selector-selected')) {
                    selectedTab.classList.remove('selector-selected');
                }
            })

            selector.classList.add('selector-selected');
            currentConfigHallId = selector.id;

            fetch('https://shfe-diplom.neto-server.ru/alldata')
                .then(response => response.json())
                .then(data => data.result)
                .then(result => {
                    halls = result.halls;
                    halls.forEach((hall) => {
                        if (Number(selector.id) === hall.id) {
                            renderSeats(hall.hall_config);
                            rows.value = hall.hall_rows;
                            places.value = hall.hall_places;
                        }
                    })

                    let chairStyle;
                    let egChairs = document.querySelectorAll('.eg-chair-btn');
                    egChairs.forEach((egChair) => {
                        egChair.onclick = function () {
                            chairStyle = egChair.id;
                        }
                    })

                    seatsEl = document.getElementById('seats');
                    seatsEl.addEventListener('click', function (event) {
                        let targetClasses = event.target.classList;
                        let targetData = event.target.dataset;
                        if (targetClasses.contains('field')) {
                            halls.forEach((hall) => {
                                if (Number(selector.id) === hall.id) {
                                    seats = hall.hall_config;
                                }
                            })
                            seats[targetData.row][targetData.col] = `${chairStyle}`;

                            renderSeats(seats);
                            console.log(seats);
                        }
                    });
                })
        }
    })

    priceConfigSelectors.forEach((selector, i) => {
        selector.onclick = () => {
            priceConfigSelectors.forEach((selectedTab, i) => {
                if (selectedTab.classList.contains('selector-selected')) {
                    selectedTab.classList.remove('selector-selected');
                }
            })

            currentPriceHallId = selector.id;
            selector.classList.add('selector-selected');

            fetch('https://shfe-diplom.neto-server.ru/alldata')
                .then(response => response.json())
                .then(data => data.result)
                .then(result => {
                    halls = result.halls;
                    halls.forEach((hall) => {
                        if (Number(selector.id) === hall.id) {
                            standart.value = hall.hall_price_standart;
                            vip.value = hall.hall_price_vip;
                        }
                    })
                })
        }
    })

    openHallSelectors.forEach((selector, i) => {
        selector.onclick = () => {
            if (!openHall.classList.contains('visually-hidden')) {
                openHall.classList.add('visually-hidden')
            }
            if (!closeHall.classList.contains('visually-hidden')) {
                closeHall.classList.add('visually-hidden')
            }
            if (!ready.classList.contains('visually-hidden')) {
                ready.classList.add('visually-hidden')
            }

            openHallSelectors.forEach((selectedTab, i) => {
                if (selectedTab.classList.contains('selector-selected')) {
                    selectedTab.classList.remove('selector-selected');
                }
            })

            currentOpenHallId = selector.id;
            selector.classList.add('selector-selected');

            fetch('https://shfe-diplom.neto-server.ru/alldata')
                .then(response => response.json())
                .then(data => data.result)
                .then(result => {
                    halls = result.halls;
                    halls.forEach((hall) => {
                        if (Number(selector.id) === hall.id) {
                            if (hall.hall_open === 0) {
                                openHall.classList.remove('visually-hidden');
                                ready.classList.remove('visually-hidden')
                            } else {
                                closeHall.classList.remove('visually-hidden');
                                ready.classList.remove('visually-hidden')
                            }
                        }
                    })
                })

        }
    })
}

let cancelHallConfig = document.querySelector('#btn-cancel-hall-config');
cancelHallConfig.onclick = function () {
    fetch('https://shfe-diplom.neto-server.ru/alldata')
        .then(response => response.json())
        .then(data => data.result)
        .then(result => {
            halls = result.halls;
            halls.forEach((hall) => {
                if (Number(currentConfigHallId) === hall.id)
                    renderSeats(hall.hall_config);
            })
        })
}

let saveHallConfig = document.querySelector('#btn-hall-config');
saveHallConfig.onclick = function () {
    const params = new FormData()
    params.set('rowCount', rows.value)
    params.set('placeCount', places.value)
    params.set('config', JSON.stringify(seats))
    fetch(`https://shfe-diplom.neto-server.ru/hall/${Number(currentConfigHallId)}`, {
        method: 'POST',
        body: params
    })
        .then(response => response.json())
        .then(data => console.log(data));
}

let cancelPriceConfig = document.querySelector('#btn-cancel-price-config');
cancelPriceConfig.onclick = function () {
    fetch('https://shfe-diplom.neto-server.ru/alldata')
        .then(response => response.json())
        .then(data => data.result)
        .then(result => {
            halls = result.halls;
            halls.forEach((hall) => {
                if (Number(currentPriceHallId) === hall.id) {
                    standart.value = hall.hall_price_standart;
                    vip.value = hall.hall_price_vip;
                }
            })
        })
}

let savePriceConfig = document.querySelector('#btn-price-config');
savePriceConfig.onclick = function () {
    const params = new FormData()
    params.set('priceStandart', standart.value)
    params.set('priceVip', vip.value)
    fetch(`https://shfe-diplom.neto-server.ru/price/${Number(currentPriceHallId)}`, {
        method: 'POST',
        body: params
    })
        .then(response => response.json())
        .then(data => console.log(data));
}

let openHall = document.querySelector('#btn-hall-open');
openHall.onclick = function () {
    const params = new FormData()
    params.set('hallOpen', '1')
    fetch(`https://shfe-diplom.neto-server.ru/open/${Number(currentOpenHallId)}`, {
        method: 'POST',
        body: params
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                openHall.classList.add('visually-hidden');
                closeHall.classList.remove('visually-hidden');
            }
        });
}
let closeHall = document.querySelector('#btn-hall-close');
closeHall.onclick = function () {
    const params = new FormData()
    params.set('hallOpen', '0')
    fetch(`https://shfe-diplom.neto-server.ru/open/${Number(currentOpenHallId)}`, {
        method: 'POST',
        body: params
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                closeHall.classList.add('visually-hidden');
                openHall.classList.remove('visually-hidden');
            }
        });
}

function deleteHall(trashcan_id) {
    fetch(`https://shfe-diplom.neto-server.ru/hall/${trashcan_id}`, {
        method: 'DELETE',
    })
        .then(() => {
            fetch('https://shfe-diplom.neto-server.ru/alldata')
                .then(response => response.json())
                .then(data => data.result)
                .then(result => {
                    halls = result.halls;
                    seances = result.seances;

                    hallList.innerHTML = '';
                    hallConfigSelectors_Wrap.innerHTML = '';
                    priceConfigSelectors_Wrap.innerHTML = '';
                    openHallSelectors_Wrap.innerHTML = '';
                    seancesTimeline.innerHTML = '';

                    halls.forEach((hall) => {
                        renderHalls(hall);
                    })

                    seances.forEach((seance) => {
                        if (seance.seance_hallid === trashcan_id) {
                            fetch(`https://shfe-diplom.neto-server.ru/seance/${seance.id}`, {
                                method: 'DELETE',
                            })
                        }
                        renderSeances(seance);
                    })

                })
        })
}

//seats

function createSeats(rowsValue, placesValue) {
    let seats = [];
    for (let i = 0; i < rowsValue; i++) {
        let row = [];
        for (let j = 0; j < placesValue; j++) {
            row.push('standart');
        }
        seats.push(row);
    }
    console.log(seats, rowsValue, placesValue);

    halls.forEach((hall) => {
        hall.hall_config = seats;
    })

    renderSeats(seats);
}

let seatsEl = document.getElementById('seats');

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
                fields.push(`<div class="field eg-chair-style chair_blocked" 
                data-row="${i}" 
                data-col="${j}"
                style="grid-row:${i + 1};grid-column:${j + 1};"
            ></div>`);
            } else {
                fields.push(`<div class="field eg-chair-style chair_normal" 
                data-row="${i}" 
                data-col="${j}"
                style="grid-row:${i + 1};grid-column:${j + 1};"
            ></div>`);
            }
        }
    }
    seatsEl.innerHTML = fields.join('');
}
