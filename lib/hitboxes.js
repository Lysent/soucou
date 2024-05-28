export class Vector {
	constructor({ x = 0, y = 0 } = {}) {
		this.x = x;
		this.y = y;
	}


	get magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	// Add(5)
	// Add(Vector)
	// Add({x, y})
	Add(factor) {
		const f = typeof factor === 'object'
			? { x: 0, y: 0, ...factor }
			: { x: factor, y: factor }
		return new Vector({
			x: this.x + f.x,
			y: this.y + f.y,
		})
	}

	Minus(factor) {
		const f = typeof factor === 'object'
			? { x: 0, y: 0, ...factor }
			: { x: factor, y: factor }
		return new Vector({
			x: this.x - f.x,
			y: this.y - f.y,
		})
	}

	// Multiply(5)
	// Multiply(Vector)
	// Multiply({x, y})
	Multiply(factor) {

		// @LATER: Use an helper in order to transform `factor`
		//  into a Vector of same Dimensions than this
		const f = typeof factor === 'object'
			? { x: 0, y: 0, ...factor }
			: { x: factor, y: factor }

		return new Vector({
			x: this.x * f.x,
			y: this.y * f.y,
		})
	}

	Rotate(theta) {
		// https://en.wikipedia.org/wiki/Rotation_matrix#In_two_dimensions
		return new Vector({
			x: this.x * Math.cos(theta) - this.y * Math.sin(theta),
			y: this.x * Math.sin(theta) + this.y * Math.cos(theta),
		});
	}


	// Todo: Use scalar product

	Project(line) {
		let dotvalue = line.direction.x * (this.x - line.origin.x)
			+ line.direction.y * (this.y - line.origin.y);

		return new Vector({
			x: line.origin.x + line.direction.x * dotvalue,
			y: line.origin.y + line.direction.y * dotvalue,
		})

	}
}

export class Line {
	constructor({ x = 0, y = 0, dx = 0, dy = 0 }) {
		this.origin = new Vector({ x, y });
		this.direction = new Vector({ x: dx, y: dy });
	}
}

export class Rect {
	constructor({
		x = 0, y = 0, w = 10, h = 10,
		// 0 is Horizontal to right (following OX) - Rotate clockwise
		theta = 0, // theta (rad)
	}) {
		this.center = new Vector({ x, y });
		this.size = new Vector({ x: w, y: h });
		this.theta = theta;
	}

	getAxis() {
		const OX = new Vector({ x: 1, y: 0 });
		const OY = new Vector({ x: 0, y: 1 });
		const RX = OX.Rotate(-this.theta);
		const RY = OY.Rotate(-this.theta);
		return [
			new Line({ ...this.center, dx: RX.x, dy: RX.y }),
			new Line({ ...this.center, dx: RY.x, dy: RY.y }),
		];
	}

	getCorners() {
		const axis = this.getAxis();
		const RX = axis[0].direction.Multiply(this.size.x / 2);
		const RY = axis[1].direction.Multiply(this.size.y / 2);
		return [
			this.center.Add(RX).Add(RY),
			this.center.Add(RX).Add(RY.Multiply(-1)),
			this.center.Add(RX.Multiply(-1)).Add(RY.Multiply(-1)),
			this.center.Add(RX.Multiply(-1)).Add(RY),
		]
	}
}

export const adaptBox = ([entity, box]) => new Rect({
	theta: entity.rot,
	w: box.w,
	h: box.h,
	x: entity.pos.x + (box.x || 0),
	y: entity.pos.y + (box.y || 0)
});

export const isRectCollide = (rectA, rectB) => {
	const rA = rectA; //typeof rectA !== Rect ? new Rect(rectA) : rectA;
	const rB = rectB; //typeof rectB !== Rect ? new Rect(rectB) : rectB;
	return isProjectionCollide({ rect: rA, onRect: rB })
		&& isProjectionCollide({ rect: rB, onRect: rA });
}

const isProjectionCollide = ({ rect, onRect }) => {
	const lines = onRect.getAxis();
	const corners = rect.getCorners();

	let isCollide = true;

	lines.forEach((line, dimension) => {
		let futhers = { min: null, max: null };
		// Size of onRect half size on line direction
		const rectHalfSize = (dimension === 0 ? onRect.size.x : onRect.size.y) / 2;
		corners.forEach(corner => {
			const projected = corner.Project(line);
			const CP = projected.Minus(onRect.center);
			// Sign: Same directon of OnRect axis : true.
			const sign = (CP.x * line.direction.x) + (CP.y * line.direction.y) > 0;
			const signedDistance = CP.magnitude * (sign ? 1 : -1);

			if (!futhers.min || futhers.min.signedDistance > signedDistance) {
				futhers.min = { signedDistance, corner, projected };
			}
			if (!futhers.max || futhers.max.signedDistance < signedDistance) {
				futhers.max = { signedDistance, corner, projected };
			}
		});

		if (!(futhers.min.signedDistance < 0 && futhers.max.signedDistance > 0
			|| Math.abs(futhers.min.signedDistance) < rectHalfSize
			|| Math.abs(futhers.max.signedDistance) < rectHalfSize)) {
			isCollide = false;
		}
	});
	return isCollide;
};

export const Canvas = {

	canvas: null,
	ctx: null,

	init(canvas) {
		Canvas.canvas = canvas;
		Canvas.ctx = Canvas.canvas.getContext('2d');

		return Canvas.canvas;
	},

	clean() {
		Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
	},

	draw(ori, rs) {
		// Get isColligind using lib function (no visual)
		//const isColliding = isRectCollide(ori, rects[1]);

		Canvas.ctx.lineWidth = 1;
		rs.forEach((rect, idx) => {
			Canvas.drawRect(rect, isRectCollide(ori, rect));
			Canvas.drawAxis(rect);
			Canvas.drawCorners(rect);
			Canvas.drawProjections({ rect: ori, onRect: rect });
			Canvas.drawProjections({ rect: rect, onRect: ori });
		});
	},

	drawRect(rect, isColliding) {
		Canvas.ctx.save();
		// Draw Rect
		Canvas.ctx.translate(rect.center.x, rect.center.y);
		Canvas.ctx.rotate(-rect.theta);
		Canvas.ctx.fillStyle = `rgba( ${isColliding ? '255,0,0' : "96,210,247"},.2)`;
		Canvas.ctx.fillRect(rect.size.x / -2, rect.size.y / -2, rect.size.x, rect.size.y);
		Canvas.ctx.restore();
	},

	drawAxis(rect) {
		const axis = rect.getAxis();
		axis.forEach(a => {
			Canvas.drawLine({
				from: a.origin.Add(a.direction.Multiply(-1000)),
				to: a.origin.Add(a.direction.Multiply(1000)),
				rgb: "96,210,247",
			});
		});
	},

	drawLine({
		from, to,
		rgb = null, rgba = null
	}) {
		Canvas.ctx.save();
		Canvas.ctx.translate(from.x, from.y);
		Canvas.ctx.beginPath();
		Canvas.ctx.strokeStyle = rgba ? `rgba(${rgba})` : `rgba(${rgb}, 1)`;
		Canvas.ctx.moveTo(0, 0);
		Canvas.ctx.lineTo(to.x - from.x, to.y - from.y);
		Canvas.ctx.stroke();
		Canvas.ctx.restore();
	},

	drawCorners(rect) {
		rect.getCorners().forEach(corner => {
			Canvas.drawPoint({ ...corner, rgb: "96,210,247" });
		})
	},
	drawPoint({ x, y, rgb }) {
		Canvas.ctx.save();
		Canvas.ctx.translate(x, y);

		Canvas.ctx.beginPath();
		Canvas.ctx.fillStyle = `rgba(${rgb},1)`;
		Canvas.ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
		Canvas.ctx.closePath();
		Canvas.ctx.fill();

		Canvas.ctx.restore();
	},

	drawProjections({ rect, onRect }) {
		const lines = onRect.getAxis();
		const corners = rect.getCorners();

		lines.forEach((line, dimension) => {
			let futhers = { min: null, max: null };
			// Size of onRect half size on line direction
			const rectHalfSize = (dimension === 0 ? onRect.size.x : onRect.size.y) / 2;

			corners.forEach(corner => {
				const projected = corner.Project(line);
				const CP = projected.Minus(onRect.center);
				// Sign: Same directon of OnRect axis : true.
				const sign = (CP.x * line.direction.x) + (CP.y * line.direction.y) > 0;
				const signedDistance = CP.magnitude * (sign ? 1 : -1);

				if (!futhers.min || futhers.min.signedDistance > signedDistance) {
					futhers.min = { signedDistance, corner, projected };
				}
				if (!futhers.max || futhers.max.signedDistance < signedDistance) {
					futhers.max = { signedDistance, corner, projected };
				}
			});

			// Draw min/max projecteds corners
			Canvas.drawPoint({ ...futhers.min.projected, rgb: "96,210,247" });
			Canvas.drawLine({ from: futhers.min.corner, to: futhers.min.projected, rgba: `${"96,210,247"},.2` });

			Canvas.drawPoint({ ...futhers.max.projected, rgb: "96,210,247" });
			Canvas.drawLine({ from: futhers.max.corner, to: futhers.max.projected, rgba: `${"96,210,247"},.2` });

			// Projection collide ?

			const projectionCollide = (futhers.min.signedDistance < 0 && futhers.max.signedDistance > 0
				|| Math.abs(futhers.min.signedDistance) < rectHalfSize
				|| Math.abs(futhers.max.signedDistance) < rectHalfSize);

			const w = Canvas.ctx.lineWidth;
			Canvas.ctx.lineWidth = 2;
			// Draw projection line on other Rect axis
			Canvas.drawLine({
				from: futhers.min.projected,
				to: futhers.max.projected,
				rgb: projectionCollide ? '255,0,0' : "96,210,247",
			});
			Canvas.ctx.lineWidth = w;
		});


	},

}