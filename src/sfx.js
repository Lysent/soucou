import { Howl } from "./howler.js";

const sounds = {};

const addSound = (name, url) => sounds[name] = new Howl({
	src: [url],
	html5: true
});

addSound("rlds", "../assets/sound/rlds.mp3");

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