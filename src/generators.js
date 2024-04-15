// pure math
const
	sqDist = (pointA, pointB) => (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2,
	pointDistance = (pointA, pointB) => Math.sqrt(sqDist(pointA, pointB)),
	distanceSort = (points, anchor) => points.sort((pointa, pointb) => pointDistance(anchor, pointa) - pointDistance(anchor, pointb)),
	entityDistanceSort = (entities, anchor) => entities.filter(e => "pos" in e).sort((enta, entb) => pointDistance(anchor.pos, enta.pos) - pointDistance(anchor.pos, entb.pos))

// behaviour
const
	onceRaw = fn => ["once", fn],
	waitRaw = (fn, time) => ["wait", time, fn],
	loopRaw = (fn, time, start = 0) => ["loop", time, fn, start];
const pushBehaviour = (entity, behaviours) => entity.behaviour.push(...behaviours);
const
	once = (entity, fn) => pushBehaviour(entity, [onceRaw(fn)]),
	wait = (entity, fn, time) => pushBehaviour(entity, [waitRaw(fn, time)]),
	loop = (entity, fn, time, start = 0) => pushBehaviour(entity, [loopRaw(fn, time, start)]);

// behaviour macros
const
	scheduleRaw = schedule => {
		const out = [];
		let time = 0;
		for (const el of schedule) {
			if (typeof el === 'number') time += el;
			if (typeof el === 'function') out.push(waitRaw(el, time))
		}
		return out;
	},
	animateRaw = (fn, delay, iterations) => {
		const out = [];
		for (let i = 0; i < iterations; i++) out.push(waitRaw(fn, delay * i));
		return out;
	}
const
	schedule = (e, schedule) => pushBehaviour(e, scheduleRaw(schedule)),
	animate = (e, fn, delay, iterations) => pushBehaviour(e, animateRaw(fn, delay, iterations))

// entity manipulators
const angle = (ori, dest) => -Math.atan2(dest.y - ori.y, dest.x - ori.x);
const
	faceRaw = (me, dest) => angle(me.pos, dest),
	faceEntityRaw = (me, entity) => angle(me.pos, entity.pos),
	faceVelocityRaw = me => angle({ x: 0, y: 0 }, me.vel),
	velocityFacingRaw = (me, velocity) => ({ x: Math.cos(me.rot) * velocity, y: -Math.sin(me.rot) * velocity })
const
	face = (me, dest) => me.rot = faceRaw(me, dest),
	faceEntity = (me, entity) => me.rot = faceEntityRaw(me, entity),
	faceVelocity = me => me.rot = faceVelocityRaw(me),

	velocityFacing = (me, velocity) => me.vel = velocityFacingRaw(me, velocity),
	velocityFacingAdd = (me, velocity) => {
		const nvel = velocityFacingRaw(me, velocity)
		me.vel.x += nvel.x;
		me.vel.y += nvel.y;
	}

// entity generators
const
	entity = (type, overrides = {}, init = () => { }) => ({
		type,

		animstate: 0,
		pos: { x: 0, y: 0 },
		rot: 0,
		vel: { x: 0, y: 0 },
		friction: 0,

		...overrides,

		behaviour: [onceRaw(init)]
	}),
	summon = (type, dim, { x, y }, overrides = {}, init = () => { }) => dim.entities.push(entity(type, { pos: { x, y }, ...overrides }, init)),
	entity_process = init => ({ behaviour: [onceRaw(init)] }),
	summon_process = (dim, init) => dim.entities.push(entity_process(init)),

	remove = (dim, entity) => dim.entities.splice(dim.entities.indexOf(entity), 1);

// bullet particle system generators
const
	particle_set = (root_entity, angle_offset) => ({

	})

const all = {
	sqDist, pointDistance, distanceSort, entityDistanceSort,

	onceRaw, waitRaw, loopRaw,
	once, wait, loop,

	scheduleRaw, animateRaw,
	schedule, animate,

	faceRaw, faceEntityRaw, faceVelocityRaw, velocityFacingRaw,
	face, faceEntity, faceVelocity, velocityFacing, velocityFacingAdd,

	entity, summon, entity_process, summon_process, remove
};
export {
	sqDist, pointDistance, distanceSort, entityDistanceSort,

	onceRaw, waitRaw, loopRaw,
	once, wait, loop,

	scheduleRaw, animateRaw,
	schedule, animate,

	faceRaw, faceEntityRaw, faceVelocityRaw, velocityFacingRaw,
	face, faceEntity, faceVelocity, velocityFacing, velocityFacingAdd,

	entity, summon, entity_process, summon_process, remove
};
export default all