const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        removeActiveClasses();

        card.classList.add('active');
    });
});

function removeActiveClasses() {
    cards.forEach(card => {
        card.classList.remove('active');
    });
}







const menu = document.getElementById("menu");
const openBtn = document.getElementById("menuToggle");
const closeBtn = document.getElementById("closeMenu");

openBtn.onclick = () => {
    menu.classList.add("active");
}

closeBtn.onclick = () => {
    menu.classList.remove("active");
}

