const Ticker = function (opt) {

	//
	// Context and api

	const
		minFrameInterval = opt.maxFps ? 1000 / opt.maxFps : 0,
		targetTps = opt.tps || 60,
		updateTimestep = 1000 / targetTps,
		performanceUpdateInterval = opt.perfReportInterval || 1000,
		performanceAlpha = opt.perfNewValueWeight || 0.9;

	let
		always = async () => { },
		begin = async () => { },
		update = async () => { },
		draw = async () => { },
		end = async () => { }

	let
		clockDelta = 0,
		lastClockTime = 0,
		lastPerformanceUpdate = 0,
		clocksSincePerformanceUpdate = 0,
		updateSteps = 0, // kept here to prevent it being garbage-collected every time
		frameHandle = 0,
		started = false,
		running = false,
		panic = false,
		pause = false;

	let perf = { fps: 1000 / minFrameInterval, tps: targetTps, mspt: 0, cpt: 0, deviation: 0, effort: 0, interval: minFrameInterval };
	const weightPerf = (old, new_) => performanceAlpha * new_ + (1 - performanceAlpha) * old;
	let
		endTick = 0,
		startTick = 0,
		countTicks = 0;

	// use animation frame if possible, otherwise best-attempt
	const requestFrame = globalThis.requestFrame || (function () {
		let lastTimestamp = Date.now(),
			now,
			timeout;
		return function (cb) {
			now = Date.now();
			// The next frame should run no sooner than the simulation allows,
			// but as soon as possible if the current frame has already taken
			// more time to run than is simulated in one timestep.
			timeout = Math.max(0, updateTimestep - (now - lastTimestamp));
			lastTimestamp = now + timeout;
			return setTimeout(function () {
				cb(now + timeout);
			}, timeout);
		};
	})();
	const cancelFrame = globalThis.cancelAnimationFrame || clearInterval;

	const api = {
		setAlways(cb) { always = cb || always; return this },
		setBegin(cb) { begin = cb || begin; return this },
		setUpdate(cb) { update = cb || update; return this },
		setDraw(cb) { draw = cb || draw; return this },
		setEnd(cb) { end = cb || end; return this },

		resetClockDelta() { // can be used to avoid death spiral
			const old = clockDelta;
			clockDelta = 0;
			return old
		},

		start() {
			if (!started) {
				started = true;

				frameHandle = requestFrame(function (timestamp) {
					// render initial state
					// draw(1);

					running = true;

					// don't simulate all time since init
					lastClockTime = timestamp;
					lastPerformanceUpdate = timestamp;
					endTick = startTick = Date.now();
					clocksSincePerformanceUpdate = 0;

					// Start the main loop.
					frameHandle = requestFrame(clock);
				});
			}
			return this;
		},
		stop() {
			running = false;
			started = false;
			cancelFrame(frameHandle);
			return this;
		},
		pause(state){
			if (!state) pause ^= 1;
			if(state) pause = state;
		},

		perf() { return perf }
	}

	//
	// Clock (main loop)
	//

	async function clock(timestamp) {
		frameHandle = requestFrame(clock);

		// always process, for things like pause toggles, etc
		await always();

		// throttling clock rate (minFrameInterval)
		if (timestamp < lastClockTime + minFrameInterval) return;

		// pause logic
		if(pause){
			lastClockTime = timestamp;
			return;
		}

		startTick = performance.now();

		clockDelta += timestamp - lastClockTime;
		lastClockTime = timestamp;

		// constant start processing
		await begin(timestamp, clockDelta);

		// update
		updateSteps = 0;
		while (clockDelta >= updateTimestep) {
			await update(updateTimestep);
			clockDelta -= updateTimestep;

			if (++updateSteps >= 240) {
				panic = true;
				break;
			}
		}
		countTicks += updateSteps;

		// graphics
		await draw(clockDelta / updateTimestep);

		endTick = performance.now();

		// performance report
		if (timestamp > lastPerformanceUpdate + performanceUpdateInterval) {
			const w = weightPerf;
			const
				tps = w(perf.tps, countTicks / (timestamp - lastPerformanceUpdate + 1) * 1000),
				fps = w(perf.fps, clocksSincePerformanceUpdate * 1000 / (timestamp - lastPerformanceUpdate)),
				mspt = w(perf.mspt, endTick - startTick),
				deviation = w(perf.deviation, 100 - (tps / targetTps) * 100),
				effort = w(perf.effort, mspt / updateTimestep * 100)

			perf = { tps, fps, mspt, deviation, effort };
			//console.log("report", perf)

			countTicks = 0;

			lastPerformanceUpdate = timestamp;
			clocksSincePerformanceUpdate = 0;
		}
		clocksSincePerformanceUpdate++;

		// cleanups, etc
		await end(perf, panic);

		panic = false;
	}

	return api;
}

export { Ticker };