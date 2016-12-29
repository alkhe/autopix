const robot = require('robotjs')

const mouse = (...args) => robot.moveMouse(...args)
const click = (...args) => robot.mouseClick(...args)
const delay = (...args) => robot.setMouseDelay(...args)
const down = () => robot.mouseToggle('down')
const up = () => robot.mouseToggle('up')
const drag = (...args) => robot.dragMouse(...args)

module.exports = {
	mouse,
	click,
	delay,
	down,
	up,
	drag
}

