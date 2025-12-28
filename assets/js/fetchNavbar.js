fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        setActiveNav();
    });

function setActiveNav() {
    let path = window.location.pathname.replace(/\/$/, '');
    let folder = path.split('/').pop();

    if (folder === "art-portfolio" || folder === "draw") folder = ".";

    document.querySelectorAll('.nav-link').forEach(link => {
        const href= link.getAttribute('href').replace(/\/$/, '');

        if (href === folder) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    })
}