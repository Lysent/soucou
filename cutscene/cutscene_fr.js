const scenes = [
    {
        title: "",
        text: "Lisotème sortit du magasin, deux crêpes à la main. Tout en marchant tranquillement dans les rues, il continua à manger une de ses crêpes jusqu'à ce qu'il n'y en ait plus. ",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "",
            portrait2: "",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "Lisotème",
        text: "Maintenant que c'est réglé, je devrais essayer de sortir d'ici.",
        images: {
            textbox: "/assets/VN/top_box_lisotem.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "",
        text: "Cet homme continue son chemin, vers les impressionnants mais vétustes murs qui entourent la ville.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "",
        text: "Quelques panneaux interdisant l’entrée se trouvaient clairement de chaque côté de la route. Il s'en fichait.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "",
        text: "Une femme aux cheveux roux et vêtue de rouge se tenait sur les remparts.",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "Cercey",
        text: "Hey ! Personne n'est autorisé à quitter la ville ! Retournez en arrière!",
        images: {
            textbox: "/assets/VN/top_box_cercey.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "Lisotème",
        text: "...",
        images: {
            textbox: "/assets/VN/top_box_lisotem.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: "/assets/VN/background_wall.png"
        }
    },
    {
        title: "",
        text: "Il fait plusieurs pas en avant. Plusieurs gardes sont apparus depuis la tour de guet pour l'intercepter. ",
        images: {
            textbox: "/assets/VN/top_box.png",
            portrait1: "/assets/VN/portrait_lisotem.png",
            portrait2: "/assets/VN/portrait_cercey.png",
            background: "/assets/VN/background_wall.png"
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