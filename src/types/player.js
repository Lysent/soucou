import { entity, entityDistanceSort, loop, pointDistance, remove, summon, wait } from "../../lib/generators.js";
import { sprite, procedure } from "../../lib/assetloader.js";

const player_type = {
    bounds: { type: "hard" },
    collision: {
        origin: true,
        box: { w: 4, h: 32 }
    },

    images: [
        await sprite("../assets/Outlineless/lisotem.png"),
        await sprite("../assets/Outlineless/lisotem_left.png"),
        await sprite("../assets/Outlineless/lisotem_right.png")
    ],

    images: [
        await sprite("../assets/Outlined/lisotem.png"),
        await sprite("../assets/Outlined/lisotem_left.png"),
        await sprite("../assets/Outlined/lisotem_right.png")
    ]
    
}

const corrupt_type = {
    bounds: { type: "void" },
    collision: { box: { w: 6, h: 6 } },
    images: [
        procedure(ctx => {
            ctx.beginPath()
            const size = 4;
            ctx.arc(0, 0, size, 0, 2 * Math.PI);
            ctx.fillStyle = "grey";
            ctx.fill();
        })
    ]
}

const type_depend = {
    player: player_type,
    corrupt: corrupt_type
}

const makePlayer = () => entity("player", { friction: Infinity, health: 50, maxHealth: 50, ccooldown: 0 }, (me, { canvas, addassets }) => {
    me.pos = { x: canvas.width / 2, y: canvas.height - 20 };

    addassets(type_depend);

    // controls
    loop(me, (me, { keys, here }) => {
        // movement
        const speed = 1;
        if (keys.ArrowDown || keys.s) me.vel.y += speed;
        if (keys.ArrowUp || keys.w) me.vel.y -= speed;
        if (keys.ArrowRight || keys.d) {
            me.vel.x += speed;
        }
        if (keys.ArrowLeft || keys.a) me.vel.x -= speed;

        // change sprite direction
        me.vel.x > 0
            ? me.animstate = 2
            : me.vel.x < 0
                ? me.animstate = 1
                : me.animstate = 0;

        // corruption
        if (me.ccooldown > 0) me.ccooldown--;
        if ((keys.c || keys.x) && me.ccooldown == 0) {
            (() => {
                const corruptibles = entityDistanceSort(here.entities, me)
                    .filter(e => e !== me)
                    .filter(e => pointDistance(e.pos, me.pos) < 40)
                    .slice(0, 3);
                corruptibles.forEach(e => {
                    if ("health" in e) return e.health -= 1;
                    remove(here, e);
                    summon("corrupt", here, { ...e.pos }, {}, me => wait(me, (me, { here }) => remove(here, me), 40));
                });
            })();
            me.ccooldown = 100;
        }
    }, 0);

    // damage on contact
    loop(me, (me, { collisions }) => {
        const damaging = collisions.filter(c => !["corrupt", "player"].includes(c.type));
        const hud = me.hud;
        if (damaging.length > 0) {
            hud.takingDamage = true;
            me.health > 0 ? me.health-- : 0
            //damaging.forEach(() => me.health > 0 ? me.health-- : 0);
        } else {
            hud.takingDamage = false;
        }
        if (me.health == 0 && !hud.dead) {
            hud.dead = true;
            wait(me, () => location.href = "./you_died_lol.html", 100);
        };
    }, 0)

    // regeneration
    loop(me, me => me.health < me.maxHealth ? me.health++ : 0, 140);
});

export { makePlayer };