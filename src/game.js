import { Ticker } from "./tick.js";
import { Canvas, adaptBox, isRectCollide } from "./hitboxes.js";

const Game = function (canvas, state) {

    const ticker = new Ticker({
        maxFps: 100,
        tps: 100
    });

    //
    // Attach input
    const keys = {};
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    //
    // graphics ticking
    Canvas.init(canvas);
    const graphics = new Graphics(canvas, state.assets);
    const draw = () => {
        const entities = state.here.entities;

        graphics.background("#1f1d36");

        entities.forEach(e => graphics.entity(e));

        if (state.showHitboxes >= 1) {
            const hitboxes = entities
                .filter(entity => "type" in entity && "collision" in state.assets[entity.type])
                .map(entity => adaptBox([entity, state.assets[entity.type].collision.box]));
            hitboxes.forEach(rect => graphics.hitbox(rect));
            if (state.showHitboxes >= 2 && entities[2]?.type) Canvas.draw(adaptBox([entities[2], state.assets[entities[2].type].collision.box]), hitboxes);
        }
    }
    ticker.setDraw(draw);

    //
    // behaviour ticking
    state.time = 0;
    const ontick = async () => {
        const now = state.time++;
        const here = state.here;

        // behaviour context
        const basebehaviourcontext = { ...context, now, here, canvas };

        // run
        for (const [i, entity] of here.entities.entries()) {

            const type = state.assets[entity.type] || {};

            const behaviourcontext = { 
                ...basebehaviourcontext, 
                collisions: [],

            };

            // collisions
            if ("collision" in type && type.collision.origin === true) {
                const myrect = adaptBox([entity, type.collision.box]);
                const collidables = Array.from(here.entities.entries()
                    .filter(([ci, entity]) => ci !== i && "type" in entity && "collision" in state.assets[entity.type])
                    .map(([i, entity]) => [entity, state.assets[entity.type].collision.box]))
                const collided = collidables
                    .filter(entbox => isRectCollide(myrect, adaptBox(entbox)))
                    .map(([entity]) => entity);
                behaviourcontext.collisions = collided;
            }

            // behaviour
            if ("behaviour" in entity) {
                entity.behaviour.push(null);
                for (const [i, behaviour] of entity.behaviour.entries()) {
                    if (behaviour === null) {
                        entity.behaviour.splice(i, 1);
                        break;
                    }
                    const context = {
                        ...behaviourcontext,
                        destroy: () => entity.behaviour.splice(i, 1)
                    }
                    try {
                        switch (behaviour[0]) {
                            case "once":
                                behaviour[1](entity, context);
                                context.destroy();
                                break;
                            case "wait":
                                if (behaviour[1] <= 0) {
                                    behaviour[2](entity, context);
                                    context.destroy();
                                }
                                behaviour[1]--;
                                break;
                            case "loop":
                                if (behaviour[3] >= behaviour[1]) {
                                    behaviour[2](entity, context, behaviour[3]);
                                    behaviour[3] = 0;
                                }
                                behaviour[3]++;
                        }
                    } catch (e) {
                        console.error(entity, e)
                    };
                }
            }

            // physics
            if (!("pos" in entity)) continue;

            const bounds = type.bounds || { type: "void" };
            switch (bounds.type) {
                case "void": // disappears if hits edge of map
                    if (
                        entity.pos.x < 0 || entity.pos.x > state.x
                        || entity.pos.y < 0 || entity.pos.y > state.y
                    ) here.entities.splice(i, 1);
                    break;

                case "soft-void": // disappears if goes beyond tolerance off edge of map
                    if (
                        entity.pos.x < -bounds.tolerance || entity.pos.x > state.x + bounds.tolerance
                        || entity.pos.y < -bounds.tolerance || entity.pos.y > state.y + bounds.tolerance
                    ) here.entities.splice(i, 1);
                    break;
            }

            if ("vel" in entity) {
                let xvel, yvel;
                switch (bounds.type) {
                    case "hard": // map walls are solid
                        const xres = entity.pos.x + entity.vel.x
                        xvel = (xres < 0)
                            ? -entity.pos.x
                            : (xres > state.x)
                                ? state.x - entity.pos.x
                                : entity.vel.x;
                        const yres = entity.pos.y + entity.vel.y
                        yvel = (yres < 0)
                            ? -entity.pos.y
                            : (yres > state.y)
                                ? state.y - entity.pos.y
                                : entity.vel.y;
                        break;

                    default: // map walls are only viewport
                        xvel = entity.vel.x;
                        yvel = entity.vel.y;
                        break;
                }

                entity.pos.x += xvel;
                entity.pos.y += yvel;
            }

            if ("friction" in entity) {
                const resist = axis => {
                    const resistance = entity.vel[axis] * -entity.friction;
                    if (
                        Math.sign(entity.vel[axis] + resistance) != Math.sign(entity.vel[axis])
                        || Math.abs(entity.vel[axis]) < 0.01
                    ) return entity.vel[axis] * -1;
                    return resistance;
                }

                entity.vel.x += resist("x");
                entity.vel.y += resist("y");
            }
        }
    }
    ticker.setUpdate(ontick);

    //
    // utils
    const joindim = dimname => state.here = state.dims[dimname];

    const context = {
        joindim,
        startdraw: () => draw(),

        state, ticker, graphics, keys
    }

    return {
        ...context
    }
}

const Graphics = function (canvas, assets) {
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    return {
        background(color) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },

        entity(entityobject) {
            if (!("pos" in entityobject) || !("type" in entityobject)) return;

            const pos = entityobject.pos;
            const rot = entityobject.rot;
            const type = entityobject.type;

            if (!("images" in assets[type])) return;

            const image = assets[type]?.images[entityobject.animstate];
            const imagetype = image[0];
            const imagecontent = image[1];

            ctx.save()
            ctx.translate(pos.x, pos.y);
            ctx.rotate(-rot);
            switch (imagetype) {
                case "img":
                    ctx.drawImage(imagecontent, -imagecontent.width / 2, -imagecontent.height / 2, imagecontent.width, imagecontent.height);
                    break;
                case "prc":
                    imagecontent(ctx, canvas, entityobject);
                    break;
            }

            ctx.restore();
        },

        hitbox(rect) {
            ctx.save();

            ctx.translate(rect.center.x, rect.center.y);
            //ctx.translate(-rect.size.x / 2, -rect.size.y / 2);
            ctx.rotate(-rect.theta);

            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            ctx.strokeRect(rect.size.x / -2, rect.size.y / -2, rect.size.x, rect.size.y);

            ctx.restore();
        }
    }
}

export { Game };