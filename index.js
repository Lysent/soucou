import { procedure, sprite } from "./lib/assetloader.js";
import { Game } from "./lib/game.js";
import { animate, entity_process, face, faceEntity, faceEntityRaw, loop, remove, summon, velocityFacing, wait, sequence } from "./lib/generators.js";

import { player, player_type_depend } from "./src/player.js";
import { hud, hud_type_depend } from "./src/hud.js";

const 
    player_i = player(),
    hud_i = hud(player_i);
player_i.hud = hud_i;


const gamecanvas = document.querySelector("#game");

const state = {
    showHitboxes: 0,

    dims: {
        main: {
            entities: [
                // marker for world processing
                entity_process((me, { here, canvas }) => {

                    sequence(me, [
                        ({ next }) => {

                            // snowball wave
                            const snowball_count = 60;
                            let snowball_iter = 0;
                            animate(me, (me, { here, canvas }) => {
                                summon(
                                    "snowball",
                                    here,
                                    { x: (canvas.width - 50) / snowball_count * snowball_iter + 25, y: 0 },
                                    {},
                                    me => {
                                        face(me, { x: canvas.width / 2, y: -100 })
                                        velocityFacing(me, -0.8);
                                    }
                                );
                                snowball_iter++;
                            }, 0, snowball_count);

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



                            let SL1 = (canvas.width / 2 - 300)
                            let SL2 = (canvas.width / 2 + 150)
                            let SL3 = (canvas.width / 2 - 75)
                            let SL4 = (canvas.width / 2 - 300)
                            let SL5 = (canvas.width / 2 + 150)
                            let SL6 = (canvas.width / 2 - 75)
                            wait(me, me => {
                                animate(me, () => {
                                    summon("snowball", here, { x: SL1, y: -40 }, { vel: { x: 0, y: 2 } });
                                    summon("snowball", here, { x: SL2, y: -40 }, { vel: { x: 0, y: 2 } });
                                    summon("snowball", here, { x: SL3, y: -100 }, { vel: { x: 0, y: 2 } });
                                    SL1 += 10;
                                    SL2 += 10;
                                    SL3 += 10;
                                }, 0, 15);

                                wait(me, me => {
                                    animate(me, () => {
                                        summon("snowball", here, { x: SL4, y: -40 }, { vel: { x: 0, y: 2 } });
                                        summon("snowball", here, { x: SL5, y: -40 }, { vel: { x: 0, y: 2 } });
                                        summon("snowball", here, { x: SL6, y: -100 }, { vel: { x: 0, y: 2 } });
                                        SL1 += 10;
                                        SL2 += 10;
                                        SL3 += 10;
                                    }, 0, 15);
                                }, 100);

                                wait(me, me => {

                                    animate(me, () => {
                                        summon("snowball", here, { x: (canvas.width / 3 + 25), y: -100 }, { vel: { x: 0, y: 2 } });
                                        summon("snowball", here, { x: (canvas.width / 3 - 25), y: -100 }, { vel: { x: 0, y: 2 } });

                                        summon("snowball", here, { x: (canvas.width / 3 * 2 + 25), y: -100 }, { vel: { x: 0, y: 2 } });
                                        summon("snowball", here, { x: (canvas.width / 3 * 2 - 25), y: -100 }, { vel: { x: 0, y: 2 } });
                                    }, 2, 50);
                                }, 100);

                                const snowball_count2 = 60;
                                let snowball_iter2 = 0;
                                const snowball_count3 = 60;
                                let snowball_iter3 = 0;
                                const snowball_count4 = 60;
                                let snowball_iter4 = 0;

                                wait(me, me => {
                                    const snowball_count2 = 60;
                                    let snowball_iter2 = 0;
                                    animate(me, (me, { here, canvas }) => {
                                        summon(
                                            "snowball",
                                            here,
                                            { x: (canvas.width - 50) / snowball_count2 * snowball_iter2 + 25, y: 0 },
                                            {},
                                            me => {
                                                face(me, { x: canvas.width / 2, y: -100 })
                                                velocityFacing(me, -2);
                                            }
                                        );
                                        snowball_iter2++;
                                    }, 0, snowball_count2);
                                }, 300);

                                wait(me, me => {
                                    const snowball_count3 = 60;
                                    let snowball_iter3 = 0;
                                    animate(me, (me, { here, canvas }) => {
                                        summon(
                                            "snowball",
                                            here,
                                            { x: (canvas.width - 150) / snowball_count3 * snowball_iter3 + 25, y: 0 },
                                            {},
                                            me => {
                                                face(me, { x: canvas.width / 2 - 150, y: -100 })
                                                velocityFacing(me, -2);
                                            }
                                        );
                                        snowball_iter3++;
                                    }, 0, snowball_count3);
                                }, 350);

                                wait(me, me => {
                                    const snowball_count4 = 60;
                                    let snowball_iter4 = 0;
                                    animate(me, (me, { here, canvas }) => {
                                        summon(
                                            "snowball",
                                            here,
                                            { x: (canvas.width + 200) / snowball_count4 * snowball_iter4 + 25, y: 0 },
                                            {},
                                            me => {
                                                face(me, { x: canvas.width / 2 + 200, y: -100 })
                                                velocityFacing(me, -2);
                                            }
                                        );
                                        snowball_iter4++;
                                    }, 0, snowball_count4);
                                }, 400);

                            }, 240);

                            wait(me, me => next(), 800)
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
                                const rot = faceEntityRaw(me, player_i);
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
                                            faceEntity(call, player_i);
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

                                    wait(me, me => {
                                        // boss curtains
                                        loop(me, (me, { canvas, destroy }) => {
                                            // snowballs
                                            animate(me, me => {
                                                const balls = [
                                                    summon("snowball", here, { x: -10, y: -10 }, { rot: (1.60 * Math.PI) }),
                                                    summon("snowball", here, { x: canvas.width + 10, y: -10 }, { rot: (1.40 * Math.PI) }),

                                                    summon("snowball", here, { x: goon_slots * 3, y: -10 }, { rot: (1.5 * Math.PI) }),
                                                    summon("snowball", here, { x: goon_slots * 5, y: -10 }, { rot: (1.5 * Math.PI) })
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
                                                    faceEntity(me, player_i);
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
                                                        me.vel.y = -3;
                                                        wait(me, me => me.vel.y = 3, 200);
                                                    }

                                                    // set damage time
                                                    hud.cerceyDamage = 100;
                                                }

                                                // death
                                                if (me.health <= 0) {
                                                    hud.cerceydead = true;
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

                                                const rot = faceEntityRaw(me, player_i);
                                                animate(me, me => {
                                                    const lbullet = summon("bullet", here, { x: me.pos.x - 10, y: me.pos.y + 5 }, { rot });
                                                    const rbullet = summon("bullet", here, { x: me.pos.x + 10, y: me.pos.y + 5 }, { rot });
                                                    velocityFacing(lbullet, 1.6)
                                                    velocityFacing(rbullet, 1.6)
                                                }, 32, 6);
                                            }, 400)
                                        }, 200);
                                    }, 200);
                                }
                            }, 2);
                        }
                    ]);
                }),

                // display hud
                hud_i,

                // player
                player_i
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
        ...player_type_depend,
        ...hud_type_depend,
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
            bounds: { type: "soft-void", tolerance: 100 },
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