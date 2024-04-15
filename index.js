import { procedure, sprite } from "./src/assetloader.js";
import { Game } from "./src/game.js";
import { animate, entity, entityDistanceSort, entity_process, faceEntity, loop, pointDistance, remove, summon, velocityFacing, wait } from "./src/generators.js";

const gamecanvas = document.querySelector("#game");

const player = entity("player", { friction: Infinity, health: 100, maxHealth: 100, ccooldown: 0 }, (me, { canvas }) => {
    me.pos = { x: canvas.width / 2, y: canvas.height - 20 };

    // controls
    loop(me, (me, { keys, here }) => {
        // movement
        const speed = 1;
        if (keys.ArrowDown) me.vel.y += speed;
        if (keys.ArrowUp) me.vel.y -= speed;
        if (keys.ArrowRight) {
            me.vel.x += speed;
        }
        if (keys.ArrowLeft) me.vel.x -= speed;

        // corruption
        if (me.ccooldown > 0) me.ccooldown--;
        if (keys.c && me.ccooldown == 0) {
            const corruptibles = entityDistanceSort(here.entities, me)
                .filter(e => e !== me)
                .filter(e => pointDistance(e.pos, me.pos) < 32)
                .slice(0, 3);
            corruptibles.forEach(e => {
                remove(here, e);
                summon("corrupt", here, { ...e.pos }, {}, me => wait(me, (me, { here }) => remove(here, me), 100));
            });
            me.ccooldown = 100;
        }
    }, 0);

    // damage on contact
    loop(me, (me, { collisions }) => {
        const damaging = collisions.filter(c => !["corrupt", "player"].includes(c.type));
        if (damaging.length > 0) {
            hud.takingDamage = true;
            damaging.forEach(() => me.health > 0 ? me.health-- : 0);
        } else {
            hud.takingDamage = false;
        }
        if (me.health == 0 && !hud.dead) {
            hud.dead = true;
            wait(me, () => location.href = "./you_died_lol.html", 100);
        };
    }, 0)

    // regeneration
    loop(me, me => me.health < me.maxHealth ? me.health++ : 0, 50)
})

const hud = entity("hud", {
    takingDamage: false,
    healthColor: "red",
    health: 1,
    corrupt: 1,
    dead: false
}, me => {
    // sync
    loop(me, me => {
        me.health = player.health / player.maxHealth;
        me.corrupt = 1 - player.ccooldown / 100;
    }, 0);

    // flash
    loop(me, me => {
        // health
        me.takingDamage ? me.healthColor = me.healthColor == "red" ? "white" : "red" : me.healthColor = "red";

        // death
        me.dead ? me.fg = me.fg == false ? true : false : me.fg = false;
    }, 10);
})

const state = {
    showHitboxes: 0,

    dims: {
        main: {
            entities: [
                // marker for world processing
                entity_process(me => {
                    // snowball rain
                    const snowball_count = 20;
                    let snowball_iter = 0;
                    animate(me, (me, { here, canvas }) => {
                        summon(
                            "snowball",
                            here,
                            { x: (canvas.width - 50) / snowball_count * snowball_iter + 25, y: 0 },
                            { vel: { x: 0, y: 0.5 } }
                        );
                        snowball_iter++;
                    }, 50, snowball_count);
                }),

                // player
                player,

                // display hud
                hud,

                // The Bullet
                entity("bullet", { vel: { x: 0, y: 2 }, friction: .01 }, (me, { canvas }) => {
                    me.pos.x = canvas.width / 2;
                    animate(me, (me, { now }) => console.log("now", now), 100, 5);
                    loop(me, (me, { here }) => {
                        faceEntity(me, here.entities[1]);
                        velocityFacing(me, 4);

                        //console.log((me.rot / (Math.PI * 2) * 400).toFixed(2))
                    }, 100);
                }),
            ]
        },
        spawn: {
            entities: [
                entity_process(me => {
                    loop(me, (me, { keys }) => {
                        if (keys.Enter) game.joindim("main")
                    }, 0)
                })
            ]
        }
    },

    x: gamecanvas.width,
    y: gamecanvas.height,

    assets: {
        player: {
            bounds: { type: "hard" },
            collision: {
                origin: true,
                box: { w: 10, h: 14 }
            },
            images: [
                await sprite("./assets/player.png")
            ]
        },
        bullet: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 6, h: 16 } },
            images: [
                await sprite("./assets/bullet.png")
            ]
        },
        snowball: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 6, h: 6 } },
            images: [
                procedure(ctx => {
                    ctx.beginPath()
                    const size = 4;
                    ctx.arc(0, 0, size, 0, 2 * Math.PI);
                    ctx.fillStyle = "white";
                    ctx.fill();
                })
            ]
        },
        corrupt: {
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
        },
        hud: {
            images: [
                procedure((ctx, canvas, me) => {
                    const { width, height } = canvas;

                    // health bar
                    const health_height = 8;
                    ctx.fillStyle = me.healthColor;
                    ctx.fillRect(0, height, width * me.health, -health_height)

                    // corrupt bar
                    const corrupt_height = 5;
                    ctx.fillStyle = me.corrupt < 1 ? "blue" : "grey";
                    ctx.fillRect(0, height - health_height, width / 5 * me.corrupt, -corrupt_height)
                    ctx.fillStyle = "white";
                    ctx.fillRect(width / 5, height - health_height, 2, -corrupt_height)

                    // deathscreen
                    if (me.fg) {
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, width, height);
                    }
                })
            ]
        }
    }
}

const game = Game(gamecanvas, state);
game.joindim("main");
game.ticker.start();

window.game = game;

// report tick
const perfcontainer = document.querySelector("#performance");
setInterval(() => {
    const { fps, tps, mspt, effort, deviation } = game.ticker.perf();
    perfcontainer.innerText = `\
    FPS: ${fps.toFixed(2)}
    TPS: ${tps.toFixed(2)}
    MSPT: ${mspt.toFixed(2)}
    Effort: ${effort.toFixed(2)}%
    Deviation: ${deviation.toFixed(2)}%`
}, 1000);