import { Howl } from "./howler.js";

const sounds = {};

const addSound = (name, url) => sounds[name] = new Howl({
	src: [url],
	html5: true
});

addSound("rlds", "../assets/sound/rlds.mp3");
addSound("lte", "../assets/sound/Lisotem's_escape.mp3");
addSound("cut", "../assets/sound/cutscene.mp3");
addSound("tit", "../assets/sound/title.mp3");

const playsound = name => {
	const sound = sounds[name]
	const id = sound.play();
	return {
		play() { sound.play(id) },
		pause() { sound.pause(id) },
		stop() { sound.stop(id) },
		fade(from, to, duration) { sound.fade(from, to, duration, id) }
	}
}

export { playsound };