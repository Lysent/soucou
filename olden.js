// snowball rain
const snowball_count = 20;
let snowball_iter = 0;
animate(me, (me, { here, canvas }) => {
	summon(
		"snowball",
		here,
		{ x: (canvas.width - 50) / snowball_count * snowball_iter + 25, y: 0 },
		{ vel: { x: 0, y: 0.5 } },
		me => {
			loop(me, me => {
				faceEntity(me, player);
				velocityFacingAdd(me, 0.02);
			}, 10)
		}
	);
	snowball_iter++;
}, 50, snowball_count);

// homeball pain
loop(me, me => {
	const homeballs = [];
	let retreat = false;
	animate(me, (me, { here, canvas }) => homeballs.push(summon(
		"snowball",
		here,
		{ x: canvas.width / 6, y: 0 },
		{ vel: { x: 0, y: 4 } },
		me => loop(me, me => {
			if (retreat) return;
			faceEntity(me, player);
			velocityFacingAdd(me, 0.2);
		}, 10)
	)), 2, 32);

	wait(me, () => homeballs.forEach(me => {
		retreat = true;
		//me.vel.x = 0;
		//me.vel.y = 4;
		velocityFacing(me, 4)
	}), 100)
}, 500);

// cheeto alert
loop(me, me => {
	const cheeto_parts = [];
	animate(me, (me, { here, canvas }) => cheeto_parts.push(summon(
		"cheeto_segment",
		here,
		{ x: canvas.width / 6 * 5, y: 0 },
		{ friction: .001 },
		me => { }
	)), 2, 32);

	loop(me, me => {
		const loc = { ...player.pos };
		cheeto_parts.forEach((me, i) => {
			if (i == 0) {
				face(me, loc);
				wait(me, me => velocityFacingAdd(me, 0.06), 100);
			} else {
				const ploc = { ...cheeto_parts[i - 1].pos };
				wait(me, me => me.pos = ploc, 0);
			}
		});
	}, 10)
}, 800);



                // The Bullet
                entity("bullet", { vel: { x: 0, y: 2 }, friction: .01 }, (me, { canvas }) => {
                    me.pos.x = canvas.width / 2;
                    animate(me, (me, { now }) => console.log("now", now), 100, 5);
                    loop(me, (me, { here }) => {
                        faceEntity(me, player);
                        velocityFacing(me, 4);

                        //console.log((me.rot / (Math.PI * 2) * 400).toFixed(2))
                    }, 100);
                })