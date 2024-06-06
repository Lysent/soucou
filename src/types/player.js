import { entity, entityDistanceSort, faceEntity, loop, pointDistance, remove, summon, velocityFacing, velocityFacingAdd, wait } from "../../lib/generators.js";
import { sprite, procedure } from "../../lib/assetloader.js";
import d from "../difficulty.js";

const _sprites = !!Number(localStorage.getItem("hideOutline"))
    ? [
        await sprite("./assets/Outlineless/lisotem.png"),
        await sprite("./assets/Outlineless/lisotem_left.png"),
        await sprite("./assets/Outlineless/lisotem_right.png")
    ]
    : [
        await sprite("./assets/Outlined/lisotem.png"),
        await sprite("./assets/Outlined/lisotem_left.png"),
        await sprite("./assets/Outlined/lisotem_right.png")
    ]

const player_type = {
    bounds: { type: "hard" },
    collision: {
        origin: true,
        box: { w: 4, h: 32 }
    },
    images: _sprites
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

const corrupt_bullet_type = {
    bounds: { type: "void" },
    collision: { box: { w: 6, h: 6 } },
    images: [
        procedure(ctx => {
            ctx.beginPath();
            const size = 4;
            ctx.ellipse(0, 0, size * 1.5, size, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "grey";
            ctx.fill();
        })
    ]
}


const type_depend = {
    player: player_type,
    corrupt: corrupt_type,
    corrupt_bullet: corrupt_bullet_type
}

const _corrupt = (here, me, distance, limit, action) => {
    const corruptibles = entityDistanceSort(here.entities, me)
        .filter(e => e !== me && !["player", "corrupt", "corrupt_bullet"].includes(e.type))
        .filter(e => pointDistance(e.pos, me.pos) < distance)
        .slice(0, limit);
    corruptibles.forEach(e => {
        if (typeof e.health === 'number') return e.health -= 1;
        remove(here, e);
        action(e);
    });
    return corruptibles.length;
}

const corrupt = (here, me, distance, limit) => _corrupt(here, me, distance, limit, target => summon("corrupt", here, { ...target.pos }, {}, me => wait(me, (me, { here }) => remove(here, me), 40)));

const _corrupting_bullet = (here, position, speed) => summon("corrupt_bullet", here, { ...position }, {}, (me) => {
    // corrupting aura
    loop(me, () => {
        corrupt(here, me, 40, 2)
    }, 10);

    // random direction
    me.rot = Math.floor(Math.random() * (2 * Math.PI + 1));
    velocityFacing(me, speed);
});

const corruption_plague = (here, me, distance, limit, speed) => _corrupt(here, me, distance, limit, target => _corrupting_bullet(here, { ...target.pos }, speed))

const _corrupt_shield_bullet = (here, position, player, life) => summon("corrupt_bullet", here, { ...position }, {}, (me) => {
    // corrupting aura
    loop(me, (me, { destroy }) => {
        const count = corrupt(here, me, 10, 1);
        if (count) {
            destroy();
            corrupt(here, me, 75, 20);
            life -= count * 100;
            remove(here, me);
        }
    }, 1);

    // tangent direction, orbit
    const gravity = 0.5;
    let distance = 10;
    const tanvel = () => {
        faceEntity(me, player);
        velocityFacing(me, gravity);


        me.rot += Math.PI / 2;
        distance += 0.1;
        life--;
        velocityFacingAdd(me, Math.sqrt(gravity * Math.abs(distance + gravity * life)));
    };
    loop(me, () => tanvel(), 10);
});

const hanged_man = (here, me, distance, limit, life) => _corrupt(here, me, distance, limit, target => _corrupt_shield_bullet(here, { ...target.pos }, me, life));

const makePlayer = () => entity("player", { friction: Infinity, health: d.player.health, maxHealth: d.player.health, ccooldown: 0, corrpower: 0 }, (me, { canvas, addassets }) => {
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
            me.corrpower += d.player.corruptRate;
        } else if (me.corrpower > 0) {
            const x = me.corrpower;
            me.corrpower = 0;
            switch (true) {
                case (x < 250):
                    corrupt(here, me, 50, 5);
                    break;
                case (x < 950):
                    corruption_plague(here, me, 80, 4, 1);
                    break;
                case (x < 1200):
                    hanged_man(here, me, 100, 75, 30);
                    break;
                default:
                    corrupt(here, me, 40, 3);
                    break;
            }
            me.ccooldown = 100;
        }
    }, 0);

    // damage on contact
    loop(me, (me, { collisions }) => {
        const damaging = collisions.filter(c => !["corrupt", "corrupt_bullet", "player"].includes(c.type));
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