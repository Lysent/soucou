const sprite = async url => await new Promise((res, rej) => {
	const img = new Image();
	img.src = url;
	const ret = ["img", img]
	img.onload = () => res(ret);
	img.onerror = () => rej(ret);
});

const procedure = fn => ["prc", fn];

export { sprite, procedure };