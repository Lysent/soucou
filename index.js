import { procedure, sprite } from "./src/assetloader.js";
import { Game } from "./src/game.js";
import { entity, entity_process } from "./src/generators.js";

const gamecanvas = document.querySelector("#game");

const state = {
    showHitboxes: 1,

    dims: {
        main: {
            entities: [
                // marker for world processing
                entity_process((me, { here, animate }) => {
                    // snowball rain
                    const snowball_count = 20;
                    let snowball_iter = 0;
                    animate(me, (me, { here, summon, canvas }) => {
                        summon("snowball", here, (canvas.width - 50) / snowball_count * snowball_iter + 25, 0, { vel: { x: 0, y: 0.5 } })
                        snowball_iter++;
                    }, 50, snowball_count)
                }),

                // player
                entity("player", { friction: Infinity }, (me, { canvas, loop }) => {
                    me.pos = { x: canvas.width / 2, y: canvas.height - 20 };

                    // controls
                    loop(me, (me, { keys }) => {
                        // movement
                        const speed = 1;
                        if (keys.ArrowDown) me.vel.y += speed;
                        if (keys.ArrowUp) me.vel.y -= speed;
                        if (keys.ArrowRight) {
                            me.vel.x += speed;
                        }
                        if (keys.ArrowLeft) me.vel.x -= speed;

                        // corruption
                    }, 0);

                    loop(me, (me, { collisions, now }) => {
                        // ouch
                        if(collisions.length > 0) console.log(`<player> oof ow ouch that hurts (${now})`)
                    }, 0)
                }),

                // The Bullet
                entity("bullet", { vel: { x: 0, y: 2 }, friction: .01 }, (me, { canvas, animate, loop }) => {
                    me.pos.x = canvas.width / 2;
                    animate(me, (me, { now }) => console.log("now", now), 100, 5);
                    loop(me, (me, { faceEntity, here, velocityFacing }) => {
                        faceEntity(me, here.entities[1]);
                        velocityFacing(me, 2);

                        //console.log((me.rot / (Math.PI * 2) * 400).toFixed(2))
                    }, 100);
                }),
            ]
        },
        spawn: {
            entities: [
                entity_process((me, { loop }) => {
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
        }
    }
}

const game = Game(gamecanvas, state);
game.joindim("spawn");
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