import { procedure, sprite } from "./lib/assetloader.js";
import { Game } from "./lib/game.js";
import { animate, entity_process, face, faceEntity, faceEntityRaw, loop, remove, summon, velocityFacing, wait, sequence } from "./lib/generators.js";

import * as types from "./src/types/types.js";
window.types = types;

const
    player = types.makePlayer(),
    hud = types.makeHud(player);
player.hud = hud;

const gamecanvas = document.querySelector("#game");
const pausemenu = document.querySelector("#pausemenu");

const state = {
    showHitboxes: 0,

    dims: {
        main: {
            entities: [
                // marker for world processing
                entity_process((me, { here, canvas }) => {
                    // custom generators
                    const center = canvas.width / 2;
                    const snowball_wave = (count, force, pushpoint = center, width = canvas.width - 50, offset = 25) => {
                        for (let i = 0; i < count; i++) {
                            summon(
                                "snowball",
                                here,
                                { x: width / count * i + offset, y: 0 },
                                {},
                                me => {
                                    face(me, { x: pushpoint, y: -100 })
                                    velocityFacing(me, -force);
                                }
                            )
                        }
                    }

                    // content
                    sequence(me, [
                        ({ next }) => {

                            // snowball wave
                            snowball_wave(60, 0.8);

                            // first lasers
                            animate(me, () => {
                                summon("snowball", here, { x: (canvas.width / 2 + 10), y: -100 }, { vel: { x: 0, y: 1 } });
                                summon("snowball", here, { x: (canvas.width / 2 - 10), y: -100 }, { vel: { x: 0, y: 1 } });

                                summon("snowball", here, { x: (canvas.width / 2 + 150), y: -100 }, { vel: { x: 0, y: 1 } });
                                summon("snowball", here, { x: (canvas.width / 2 + 170), y: -100 }, { vel: { x: 0, y: 1 } });

                                summon("snowball", here, { x: (canvas.width / 2 - 150), y: -100 }, { vel: { x: 0, y: 1 } });
                                summon("snowball", here, { x: (canvas.width / 2 - 170), y: -100 }, { vel: { x: 0, y: 1 } });

                                summon("snowball", here, { x: (canvas.width / 2 + 250), y: -100 }, { vel: { x: 0, y: 1 } });
                                summon("snowball", here, { x: (canvas.width / 2 + 270), y: -100 }, { vel: { x: 0, y: 1 } });

                                summon("snowball", here, { x: (canvas.width / 2 - 250), y: -100 }, { vel: { x: 0, y: 1 } });
                                summon("snowball", here, { x: (canvas.width / 2 - 270), y: -100 }, { vel: { x: 0, y: 1 } });

                            }, 2, 75);

                            wait(me, me => next(), 240)
                        },
                        ({ next }) => {
                            const screen = () => {
                                for (let i = 0; i < 15; i++) {
                                    summon("snowball", here, { x: center - 300 + 10 * i, y: -40 }, { vel: { x: 0, y: 2 } });
                                    summon("snowball", here, { x: center + 150 + 10 * i, y: -40 }, { vel: { x: 0, y: 2 } });
                                    summon("snowball", here, { x: center - 75 + 10 * i, y: -100 }, { vel: { x: 0, y: 2 } });
                                };
                            };

                            screen();
                            wait(me, me => {
                                screen();

                                // center lasers
                                animate(me, () => {
                                    summon("snowball", here, { x: (canvas.width / 3 + 25), y: -100 }, { vel: { x: 0, y: 2 } });
                                    summon("snowball", here, { x: (canvas.width / 3 - 25), y: -100 }, { vel: { x: 0, y: 2 } });

                                    summon("snowball", here, { x: (canvas.width / 3 * 2 + 25), y: -100 }, { vel: { x: 0, y: 2 } });
                                    summon("snowball", here, { x: (canvas.width / 3 * 2 - 25), y: -100 }, { vel: { x: 0, y: 2 } });
                                }, 2, 50);
                            }, 100);

                            wait(me, me => next(), 300)

                        },
                        ({ next }) => {
                            snowball_wave(60, 2);
                            wait(me, me => snowball_wave(60, 2, center - 150), 50);
                            wait(me, me => snowball_wave(60, 2, center + 150), 100);

                            wait(me, me => next(), 500);
                        },
                        ({ next }) => {
                            const goon_slots = canvas.width / 8;
                            const goons = [
                                summon("goon", here, { x: goon_slots * 3, y: -10 }, { vel: { x: 0, y: 1 }, friction: 0.02 }),
                                summon("goon", here, { x: goon_slots * 4, y: -10 }, { vel: { x: 0, y: 1 }, friction: 0.02 }),
                                summon("goon", here, { x: goon_slots * 5, y: -10 }, { vel: { x: 0, y: 1 }, friction: 0.02 })
                            ];

                            // curtains
                            let curtains = true;
                            loop(me, (me, { destroy }) => {
                                if (!curtains) return destroy();

                                const width = 1 / 32;
                                const rrot = (Math.PI * 1.5) + (Math.PI * width) * (Math.random() - 0.5);

                                const balls = [
                                    summon("snowball", here, { x: goon_slots * 1, y: -10 }),
                                    summon("snowball", here, { x: goon_slots * 2, y: -10 }),

                                    summon("snowball", here, { x: goon_slots * 6, y: -10 }),
                                    summon("snowball", here, { x: goon_slots * 7, y: -10 }),

                                    summon("snowball", here, { x: goon_slots * 3.5, y: -10 }),
                                    summon("snowball", here, { x: goon_slots * 4.5, y: -10 })
                                ];
                                balls.forEach(b => {
                                    b.rot = rrot;
                                    velocityFacing(b, 1);
                                });
                            }, 80);

                            // we do a lil shifting
                            const shufflin_range = 5;
                            goons.forEach(g => {
                                const ori = g.pos.x;
                                let direction = (Math.random() < 0.5) ? 1 : -1;
                                loop(g, me => {
                                    me.pos.x += direction;
                                    if (Math.abs(me.pos.x - ori) > shufflin_range) direction *= -1;
                                }, Math.floor(Math.random() * (14 - 8 + 1)) + 8);

                                // change sprite direction & animate shooting
                                loop(g, me => {
                                    direction == -1
                                        ? me.animstate = 0
                                        : me.animstate = 1;
                                    me.shooting
                                        ? me.animstate += 2
                                        : 0;
                                }, 0)
                            });

                            // shooting
                            goons.forEach(g => loop(g, me => {
                                const rot = faceEntityRaw(me, player);
                                me.shooting = true;
                                animate(me, me => {
                                    const bullet = summon("bullet", here, { ...me.pos, y: me.pos.y + 5 }, { rot });
                                    velocityFacing(bullet, 1.6)
                                }, 20, 4)
                                wait(me, me => me.shooting = false, 20 * 4);
                            }, 200));

                            // proceeding
                            loop(me, (me, { here, destroy }) => {
                                const numgoons = goons.reduce((acc, g) => acc + here.entities.includes(g), 0);

                                // curtain call
                                if (numgoons == 1 && curtains === true) {
                                    curtains = 1;
                                    wait(me, me => loop(me, (me, { destroy }) => {
                                        const snowballs = here.entities.filter(e => e.type == "snowball");
                                        if (snowballs.length > 0) {
                                            remove(here, snowballs[0]);
                                            const call = summon("bullet", here, { ...snowballs[0].pos });
                                            faceEntity(call, player);
                                            velocityFacing(call, 2);
                                        } else {
                                            destroy();
                                            curtains = false;
                                        }

                                    }, 4), 200)
                                }

                                // boss section
                                if (numgoons == 0) {
                                    destroy();

                                    wait(me, me => next(), 200);
                                }
                            }, 2);
                        },
                        ({ next }) => {
                            // boss curtains
                            const boss_slots = canvas.width / 8
                            loop(me, (me, { canvas, destroy }) => {
                                // snowballs
                                animate(me, me => {
                                    const balls = [
                                        summon("snowball", here, { x: -10, y: -10 }, { rot: (1.60 * Math.PI) }),
                                        summon("snowball", here, { x: canvas.width + 10, y: -10 }, { rot: (1.40 * Math.PI) }),

                                        summon("snowball", here, { x: boss_slots * 3, y: -10 }, { rot: (1.5 * Math.PI) }),
                                        summon("snowball", here, { x: boss_slots * 5, y: -10 }, { rot: (1.5 * Math.PI) })
                                    ];
                                    balls.forEach(b => velocityFacing(b, 2))
                                }, 10, 2);
                            }, 80);
                            loop(me, (me, { canvas }) => {
                                // icbulletm
                                const icbm = [
                                    summon("bullet", here, { x: 30, y: -10 }, { rot: (1.60 * Math.PI) }),
                                    summon("bullet", here, { x: canvas.width - 30, y: -10 }, { rot: (1.40 * Math.PI) }),
                                ];
                                icbm.forEach(bm => {
                                    velocityFacing(bm, 1);
                                    wait(bm, me => {
                                        faceEntity(me, player);
                                        velocityFacing(me, 0.4);
                                    }, 400);
                                });
                            }, 140);

                            // cercey
                            wait(me, me => {
                                const cercey = summon("cercy", here, { x: canvas.width / 2, y: -10 }, { vel: { x: 0, y: 1.4 }, friction: 0.02 });

                                // cercey shuffle
                                const shufflin_range = 10;
                                const ori = cercey.pos.x;
                                let direction = (Math.random() < 0.5) ? 1 : -1;
                                loop(cercey, me => {
                                    me.pos.x += direction;
                                    if (Math.abs(me.pos.x - ori) > shufflin_range) direction *= -1;
                                }, Math.floor(Math.random() * (14 - 8 + 1)) + 8);

                                // cercy health
                                cercey.health = 5;
                                hud.cercey = cercey;
                                let prevhealth = 5;
                                loop(cercey, (me, { destroy }) => {
                                    // damage flash
                                    hud.cerceyDamage > 0 ? hud.cerceyDamage -= 1 : 0;
                                    if (me.health < prevhealth && me.health !== 0) {
                                        prevhealth = me.health;

                                        // retreat
                                        if (me.vel.y < 0.05) {
                                            me.vel.y += -3;
                                            wait(me, me => me.vel.y += 3, 200);
                                        }

                                        // set damage time
                                        hud.cerceyDamage = 100;
                                    }

                                    // death
                                    if (me.health <= 0) {
                                        hud.cerceydead = true;
                                        player.health = 9999;
                                        destroy();

                                        loop(me, me => {
                                            me.rot += Math.PI / 8;
                                        }, 10);
                                        wait(me, me => location.href = "./win_screen.html", 500);
                                    }
                                }, 0);

                                // cercey bullets
                                loop(cercey, (me, { destroy }) => {
                                    if (me.health <= 0) return destroy();

                                    const rot = faceEntityRaw(me, player);
                                    animate(me, me => {
                                        const lbullet = summon("bullet", here, { x: me.pos.x - 10, y: me.pos.y + 5 }, { rot });
                                        const rbullet = summon("bullet", here, { x: me.pos.x + 10, y: me.pos.y + 5 }, { rot });
                                        velocityFacing(lbullet, 1.6)
                                        velocityFacing(rbullet, 1.6)
                                    }, 32, 6);
                                }, 400)
                            }, 200);
                        }
                    ]);
                }),

                // display hud
                hud,

                // player
                player
            ]
        },
        spawn: {
            entities: [
                entity_process(me => {
                    loop(me, (me, { keys }) => {
                        if (keys.Enter) game.joindim("main");
                    }, 0)
                })
            ]
        }
    },

    x: gamecanvas.width,
    y: gamecanvas.height,

    assets: {
        snowball: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 6, h: 6 } },
            images: [
                procedure(ctx => {
                    ctx.beginPath();
                    const size = 4;
                    ctx.arc(0, 0, size, 0, 2 * Math.PI);
                    ctx.fillStyle = "white";
                    ctx.fill();
                })
            ]
        },
        bullet: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 6, h: 6 } },
            images: [
                procedure(ctx => {
                    ctx.beginPath();
                    const size = 4;
                    ctx.ellipse(0, 0, size * 1.5, size, 0, 0, 2 * Math.PI);
                    ctx.fillStyle = "mediumpurple";
                    ctx.fill();
                })
            ]
        },
        goon: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 16, h: 24 } },
            images: [
                await sprite("./assets/goon_left.png"),
                await sprite("./assets/goon_right.png"),
                await sprite("./assets/goon_left_shoot.png"),
                await sprite("./assets/goon_right_shoot.png")
            ]
        },
        cercy: {
            bounds: { type: "soft-void", tolerance: 1000 },
            collision: { box: { w: 16, h: 24 } },
            images: [
                await sprite("./assets/cercey.png"),
            ]
        },
        cheeto_segment: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 14, h: 14 } },
            images: [
                procedure(ctx => {
                    ctx.beginPath();
                    const size = 10;
                    ctx.arc(0, 0, size, 0, 2 * Math.PI);
                    ctx.fillStyle = "yellow";
                    ctx.fill();
                })
            ]
        }
    },

    alwaysRun: [
        ({ ticker, keys }) => {
            let pausebtn = false, prevpause = false;
            return () => {
                pausebtn = !!(keys.n || keys.Escape);
                if (pausebtn == true && prevpause == false) {
                    const pausestate = ticker.pause();
                    pausemenu.style.visibility = pausestate ? "visible" : "hidden";
                }
                prevpause = pausebtn;
            }
        }
    ]
}

const game = Game(gamecanvas, state);
game.joindim("main");
game.start();

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

// adjust canvas size
const holder = document.querySelector(".holder");
const aspect = 4 / 3;
const adjustsize = () => {
    const ww = document.documentElement.clientWidth;
    const wh = document.documentElement.clientHeight;

    if (ww * 1 / aspect < wh) {
        holder.style.width = `${ww}px`;
        holder.style.height = `${ww * 1 / aspect}px`;
    } else {
        holder.style.width = `${wh * aspect}px`;
        holder.style.height = `${wh}px`;
    }
};
setInterval(() => adjustsize(), 100);
adjustsize();