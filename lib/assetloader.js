const sprite = async url => await new Promise(async (res, rej) => {
	const img = new Image();
	img.src = URL.createObjectURL(await fetch(url).then(res => res.blob()));
	const ret = ["img", img]
	img.onload = () => res(ret);
	img.onerror = () => rej(ret);
});

const procedure = fn => ["prc", fn];

export { sprite, procedure };