const scenes = [
    {
        title: "",
        text: "Lisotem walked out of the shop, two crepes in hand. As he leisurely walked on the streets, he kept eating one of his crepes until it was no more.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "Lisotem",
        text: "Now that's settled, I should try to get out of here.",
        images: {
            textbox: "/assets/VN/top_box_lisotem.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "",
        text: "The gentleman continued onwards, towards the impressive yet antiquated walls surrounding the city.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "",
        text: "A few signs prohibiting entry clearly stood on either sides of the road. He cared not.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: ""
        }
    },
    {
        title: "",
        text: "A red-haired and red-clad woman stood on the walkway.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
    {
        title: "Cercey",
        text: "Hey! No one is allowed to leave the city! Get back!",
        images: {
            textbox: "/assets/VN/top_box_cercey.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
    {
        title: "Lisotem",
        text: "...",
        images: {
            textbox: "/assets/VN/top_box_lisotem.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
    {
        title: "",
        text: "He took several steps forward. Several goons appeared from the watchtower to intercept him.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: ""
        }
    },
]

let currentIndex = 0;

const title = document.querySelector('.title');
const text = document.querySelector('.text');
const portrait1 = document.querySelector('.portrait1');
const portrait2 = document.querySelector('.portrait2');
const background = document.querySelector('.backimg');

const advance = () => {
    const i = currentIndex;
    currentIndex++;
    if (currentIndex > scenes.length) {
        window.location.href = "/game.html";
    }

    const scene = scenes[i];

    title.textContent = scene.title;
    title.style.backgroundImage = `url(${scene.images.textbox})`;

    text.textContent = scene.text;

    portrait1.src = scene.images.portrait1;
    portrait1.alt = scene.images.portrait1 ? `Portrait 1 for scene ${currentIndex}` : "";
    portrait2.src = scene.images.portrait2;
    portrait2.alt = scene.images.portrait2 ? `Portrait 2 for scene ${currentIndex}` : "";

    background.src = scene.images.background;
}

document.addEventListener('click', () => advance());

advance();

// avatar size because css sometimes just doesn't like me
const avatars = document.querySelector(".avatars");
const propersize = () => {
    const rect = avatars.getBoundingClientRect();

    portrait1.style.height = portrait2.style.height = rect.height / 100 * 80 + "px";
};

setInterval(propersize, 100);
propersize();