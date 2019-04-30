import color from 'color';

export function randomizeColor() {
	return color.hsl(Math.random() * 256, 90, 75);
}

/**
 * Creates a class that pulsates a color, using a starting time and trigonometry
 */
export default class colorPulse {
	constructor(color, startTime = Date.now()) {
		this.baseColor = color;
		this.pulseTime = 200;
		this.startTime = startTime;
	}
	getColor(now) {
		let deltaTime = now - this.startTime;
		let sin = (Math.sin(deltaTime / this.pulseTime) + 1) / 2;
		return this.baseColor.desaturate(sin / 2);
	}
}