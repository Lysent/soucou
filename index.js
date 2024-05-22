import { procedure, sprite } from "./src/assetloader.js";
import { Game } from "./src/game.js";
import { animate, entity, entityDistanceSort, entity_process, face, faceEntity, faceEntityRaw, loop, pointDistance, remove, summon, velocityFacing, velocityFacingAdd, wait } from "./src/generators.js";

const gamecanvas = document.querySelector("#game");

const player = entity("player", { friction: Infinity, health: 50, maxHealth: 50, ccooldown: 0 }, (me, { canvas }) => {
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
})

const hud = entity("hud", {
    takingDamage: false,
    healthColor: "red",
    health: 1,
    corrupt: 1,
    dead: false,

    // cercey
    cerceyhealth: 5,
    cerceyDamage: false,
    cerceyhealthColor: "red",
    cerceydead: false
}, me => {
    // player

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

    // cercy
    loop(me, (me, { destroy }) => {
        if (me.cercey) {
            destroy();

            // sync
            loop(me, me => {
                me.cerceyhealth = me.cercey.health / 5;
            }, 0);

            // flash
            loop(me, me => {
                // health
                me.cerceyDamage ? me.cerceyhealthColor = me.cerceyhealthColor == "red" ? "white" : "red" : me.cerceyhealthColor = "red";

                // death
                me.cerceydead ? me.fg = me.fg == false ? true : false : me.fg = false;
            }, 10);
        }
    }, 100);
})

const state = {
    showHitboxes: 0,

    dims: {
        main: {
            entities: [
                // marker for world processing
                entity_process((me, { here, canvas }) => {

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

                    // goonery
                    wait(me, me => {
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

                                            const rot = faceEntityRaw(me, player);
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
                    }, 500);
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
                box: { w: 4, h: 32 }
            },
            images: [
                await sprite("./assets/lisotem.png"),
                await sprite("./assets/lisotem_left.png"),
                await sprite("./assets/lisotem_right.png")
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
        bullet: {
            bounds: { type: "soft-void", tolerance: 100 },
            collision: { box: { w: 6, h: 6 } },
            images: [
                procedure(ctx => {
                    ctx.beginPath()
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
                    ctx.beginPath()
                    const size = 10;
                    ctx.arc(0, 0, size, 0, 2 * Math.PI);
                    ctx.fillStyle = "yellow";
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

                    // cercey
                    if ("cercey" in me) {
                        // health bar
                        ctx.fillStyle = me.cerceyhealthColor;
                        ctx.fillRect(0, 0, width * me.cerceyhealth, health_height)
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