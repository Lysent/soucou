import { entity, loop } from "../../lib/generators.js";
import { procedure } from "../../lib/assetloader.js";
import d from "../difficulty.js";

const hud_type = {
    images: [
        procedure((ctx, canvas, me) => {
            const { width, height } = canvas;

            // health bar
            const health_height = 8;
            ctx.fillStyle = me.healthColor;
            ctx.fillRect(0, height, width * me.health, -health_height);

            // corrupt power bar
            const corrpower_height = 6;
            ctx.fillStyle = "grey";
            ctx.fillRect(0, height - health_height, width * me.power, -corrpower_height);
            ctx.fillStyle = "white";
            ctx.fillRect(width / 1200 * 250, height - health_height, 2, -corrpower_height);
            ctx.fillRect(width / 1200 * 950, height - health_height, 2, -corrpower_height);

            // corrupt cooldown bar
            const corrupt_height = 5;
            ctx.fillStyle = me.corrupt < 1 ? "blue" : "grey";
            ctx.fillRect(0, height - health_height - corrpower_height, width / 5 * me.corrupt, -corrupt_height);
            ctx.fillStyle = "white";
            ctx.fillRect(width / 5, height - health_height - corrpower_height, 2, -corrupt_height);

            // deathscreen
            if (me.fg) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, width, height);
            }

            // cercey
            if ("cercey" in me) {
                // health bar
                ctx.fillStyle = me.cerceyhealthColor;
                ctx.fillRect(0, 0, width * me.cerceyhealth, health_height);
            }
        })
    ]
};

const type_depend = {
    hud: hud_type
}

const makeHud = player => entity("hud", {
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
}, (me, { addassets }) => {
    addassets(type_depend);

    // player

    // sync
    loop(me, me => {
        me.health = player.health / player.maxHealth;
        me.corrupt = 1 - player.ccooldown / 100;
        me.power = player.corrpower / 1200;
    }, 0);

    // flash
    loop(me, me => {
        // health
        me.takingDamage ? me.healthColor = me.healthColor == "red" ? "white" : "red" : me.healthColor = "red";
        if(me.takingDamage){
            // damage sound
            playsound("hit");
        }

        // death
        me.dead ? me.fg = me.fg == false ? true : false : me.fg = false;
    }, 15);

    // cercy
    loop(me, (me, { destroy }) => {
        if (me.cercey) {
            destroy();

            // sync
            loop(me, me => {
                me.cerceyhealth = me.cercey.health / d.cercey.health;
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
});

export { makeHud };