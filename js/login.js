document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
});

let authBtn = document.querySelector('.btn');
authBtn.onclick = function () {
    adminLoginValue = document.getElementById('email').value;
    adminPasswordValue = document.getElementById('password').value;

    const authorisation = new FormData()
    authorisation.set('login', adminLoginValue);
    authorisation.set('password', adminPasswordValue);

    fetch('https://shfe-diplom.neto-server.ru/login', {
        method: 'POST',
        body: authorisation
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                alert('Авторизация пройдена успешно!');
                localStorage.setItem('loginApproved', 1);
                window.location.href = 'admin.html';
            } else {
                localStorage.setItem('loginFailed', 0);
                alert(data.error)
            }
        });
}

