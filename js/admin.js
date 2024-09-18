if (localStorage.getItem('loginApproved')) {
} else if (localStorage.getItem('loginFailed')) {
    localStorage.removeItem('loginFailed')
    document.querySelector('html').innerHTML = '';
    alert('Доступ запрещен.');
    window.location.href = 'login.html';
} else {
    document.querySelector('html').innerHTML = '';
    alert('Доступ запрещен.');
    window.location.href = 'login.html';
}

sections = document.querySelectorAll('.conf-step');
sections[0].classList.add('first-section');
sections[sections.length - 1].classList.add('last-section');
sections.forEach((section) => {
    if (!section.classList.contains('section') && !section.classList.contains('first-section') && !section.classList.contains('last-section')) {
        section.classList.add('section');
    }
});


