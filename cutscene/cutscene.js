const scenes = [
    {
        title: "",
        text: "Lisotem walked out of the shop, two crepes in hand. As he leisurely walked on the streets, he kept eating one of his crepes until it was no more.",
        images: {
            textbox: "/assets/VN/tbox.PNG",
            portrait1: "",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "",
        text: "The gentleman continued onwards, towards the impressive yet antiquated walls surrounding the city.",
        images: {
            textbox: "/assets/VN/lisotem_tbox.PNG",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "",
        text: "A few signs prohibiting entry clearly stood on either sides of the road. He cared not.",
        images: {
            textbox: "/assets/VN/lisotem_tbox.PNG",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "",
        text: "A red-haired and red-clad woman stood on the walkway.",
        images: {
            textbox: "/assets/VN/lisotem_tbox.PNG",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
    {
        title: "Cercey",
        text: "Hey! No one is allowed to leave the city! Get back!",
        images: {
            textbox: "/assets/VN/lisotem_tbox.PNG",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
    {
        title: "Lisotem",
        text: "...",
        images: {
            textbox: "/assets/VN/lisotem_tbox.PNG",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
    {
        title: "",
        text: "He took several steps forward. Several goons appeared from the watchtower to intercept him.",
        images: {
            textbox: "/assets/VN/lisotem_tbox.PNG",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
]

let currentIndex = 0;

const titleElement = document.querySelector('.title');
const textElement = document.querySelector('.text');
// const imageElement = document.querySelector('.image');

const advance = () => {
    const i = currentIndex;
    currentIndex++;
    if (currentIndex > scenes.length) {
        window.location.href = "/game.html";
    }

    const scene = scenes[i];

    textElement.textContent = scene.text;
    titleElement.textContent = scene.title;
    // imageElement.src = images[currentIndex].src;
    // imageElement.alt = images[currentIndex].alt;
}

document.addEventListener('click', () => advance());

advance();