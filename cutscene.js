const titles = [
    "First text",
    "Second text",
    "Third text",
    "Fourth text"
];

const texts = [
    "First text",
    "Second text",
    "Third text",
    "Fourth text"
];

const images = [
    { src: "image1.jpg", alt: "Image 1" },
    { src: "image2.jpg", alt: "Image 2" },
    { src: "image3.jpg", alt: "Image 3" },
    { src: "image4.jpg", alt: "Image 4" }
];

let currentIndex = 0;

const titleElement = document.querySelector('.title');
const textElement = document.querySelector('.text');
//const imageElement = document.querySelector('.image');

document.addEventListener('click', function () {

    textElement.textContent = texts[currentIndex];
    titleElement.textContent = titles[currentIndex];
    //imageElement.src = images[currentIndex].src;
    //imageElement.alt = images[currentIndex].alt;

    currentIndex++;
    if (currentIndex >= texts.length) {
        currentIndex = 0;
    }
});