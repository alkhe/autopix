const robot = require('robotjs')

const mouse = (...args) => robot.moveMouse(...args)
const click = (...args) => robot.mouseClick(...args)
const delay = (...args) => robot.setMouseDelay(...args)

module.exports = {
	mouse,
	click,
	delay
}

