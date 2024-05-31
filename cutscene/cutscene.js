const lang = localStorage.getItem('languageScript');
console.log(lang);
const scripts = {
    en: [
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
    ],
    fr:  [
        {
            title: "",
            text: "Lisotème sortit du magasin, deux crêpes à la main. Tout en marchant tranquillement dans les rues, il continua à manger une de ses crêpes jusqu'à ce qu'il n'y en ait plus. ",
            images: {
                textbox: "/assets/VN/top_box.png",
                portrait1: "",
                portrait2: "",
                background: ""
            }
        },
        {
            title: "Lisotème",
            text: "Maintenant que c'est réglé, je devrais essayer de sortir d'ici.",
            images: {
                textbox: "/assets/VN/top_box_lisotem.png",
                portrait1: "/assets/VN/portrait_lisotem.png",
                portrait2: "",
                background: ""
            }
        },
        {
            title: "",
            text: "Cet homme continue son chemin, vers les impressionnants mais vétustes murs qui entourent la ville.",
            images: {
                textbox: "/assets/VN/top_box.png",
                portrait1: "/assets/VN/portrait_lisotem.png",
                portrait2: "",
                background: ""
            }
        },
        {
            title: "",
            text: "Quelques panneaux interdisant l’entrée se trouvaient clairement de chaque côté de la route. Il s'en fichait.",
            images: {
                textbox: "/assets/VN/top_box.png",
                portrait1: "/assets/VN/portrait_lisotem.png",
                portrait2: "",
                background: ""
            }
        },
        {
            title: "",
            text: "Une femme aux cheveux roux et vêtue de rouge se tenait sur les remparts.",
            images: {
                textbox: "/assets/VN/top_box.png",
                portrait1: "/assets/VN/portrait_lisotem.png",
                portrait2: "/assets/VN/portrait_cercey.png",
                background: ""
            }
        },
        {
            title: "Cercey",
            text: "Hey ! Personne n'est autorisé à quitter la ville ! Retournez en arrière!",
            images: {
                textbox: "/assets/VN/top_box_cercey.png",
                portrait1: "/assets/VN/portrait_lisotem.png",
                portrait2: "/assets/VN/portrait_cercey.png",
                background: ""
            }
        },
        {
            title: "Lisotème",
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
            text: "Il fait plusieurs pas en avant. Plusieurs gardes sont apparus depuis la tour de guet pour l'intercepter. ",
            images: {
                textbox: "/assets/VN/top_box.png",
                portrait1: "/assets/VN/portrait_lisotem.png",
                portrait2: "/assets/VN/portrait_cercey.png",
                background: ""
            }
        },
    ]
}

const scenes = scripts[lang];

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

// showroom size because css dislikes me more than I thought
const container = document.querySelector(".container");
const aspect = 4 / 3;
const adjustsize = () => {
    const ww = document.documentElement.clientWidth;
    const wh = document.documentElement.clientHeight;

    if (ww * 1 / aspect < wh) {
        container.style.width = `${ww}px`;
        container.style.height = `${ww * 1 / aspect}px`;
    } else {
        container.style.width = `${wh * aspect}px`;
        container.style.height = `${wh}px`;
    }
};
setInterval(() => adjustsize(), 100);
adjustsize();