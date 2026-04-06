const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".mosaic-card");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let index = 3; // start after clones
let isMoving = false;

const visibleCards = 3;
const gap = 20;

// clone first & last
const firstClones = [];
const lastClones = [];

cards.forEach((card, i) => {
    if (i < visibleCards) {
        firstClones.push(card.cloneNode(true));
    }
    if (i >= cards.length - visibleCards) {
        lastClones.push(card.cloneNode(true));
    }
});

// add clones
lastClones.forEach(clone => track.prepend(clone));
firstClones.forEach(clone => track.append(clone));

const allCards = document.querySelectorAll(".carousel-track .mosaic-card");
const cardWidth = allCards[0].offsetWidth + gap;

// initial position
track.style.transform = `translateX(-${index * cardWidth}px)`;

// move function
function moveToIndex() {
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(-${index * cardWidth}px)`;
}

// NEXT
nextBtn.addEventListener("click", () => {
    if (isMoving) return;
    isMoving = true;

    index++;
    moveToIndex();

    setTimeout(() => {
        if (index >= allCards.length - visibleCards) {
            track.style.transition = "none";
            index = visibleCards;
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        }
        isMoving = false;
    }, 500);
});

// PREV
prevBtn.addEventListener("click", () => {
    if (isMoving) return;
    isMoving = true;

    index--;
    moveToIndex();

    setTimeout(() => {
        if (index < visibleCards) {
            track.style.transition = "none";
            index = allCards.length - visibleCards * 2;
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        }
        isMoving = false;
    }, 500);
});


// AUTO SLIDE
setInterval(() => {
    nextBtn.click();
}, 5000);


//  SWIPE (mobile)
let startX = 0;

track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
        nextBtn.click();
    } else if (endX - startX > 50) {
        prevBtn.click();
    }
});