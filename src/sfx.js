import { Howl } from "./howler.js";

const sounds = {};

const addSound = (name, url, params = {}) => sounds[name] = new Howl({
	src: [new URL(url, import.meta.url)],
	html5: true,
	...params
});

addSound("tit", "../assets/sound/title.mp3");
addSound("cut", "../assets/sound/cutscene.mp3");
addSound("rlds", "../assets/sound/rlds.mp3");
addSound("lte", "../assets/sound/Lisotem's_escape.mp3", { volume: 0.8 });
addSound("cerc", "../assets/sound/cercey.mp3");

addSound("bigbullet", "../assets/sound/shootWhoof.wav", { volume: 0.6 });
addSound("corrupt", "../assets/sound/corrupt.wav", { volume: 0.2 });
addSound("hit", "../assets/sound/hitHurt.wav");
addSound("enemyhit", "../assets/sound/enemyHurt.wav", { volume: 0.8 });

const playsound = name => {
	const sound = sounds[name]
	const id = sound.play();
	return {
		play() { sound.play(id) },
		pause() { sound.pause(id) },
		stop() { sound.stop(id) },
		fade(from, to, duration) { sound.fade(from, to, duration, id) },
		loop(state) { sound.loop(state, id) },
		volume(volume) { sound.volume(volume, id) }
	}
}

export { playsound };