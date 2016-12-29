const { resolve } = require('path')
const { readdirSync: ls } = require('fs')
const { contrast, map_image, read_png, write_image } = require('./image')
const { mouse, click, delay, down, up, drag } = require('./automate')

const args = process.argv.slice(2)
const file = resolve(args[0])

const opts = {
	// origin x
	x: 150,
	// origin y
	y: 150,
	// luminance threshold
	l: 128
}

args.slice(1).forEach(a => {
	const opt = a[0]
	const val = Number(a.substr(1))
	opts[opt] = val
})

function log_next(image) {
	console.log(`top-left (x, y): (${ opts.x }, ${ opts.y })`)
	console.log(`bottom-right (x, y): (${ opts.x + image.width }, ${ opts.y + image.height })`)
	return image
}

function pen_draw(image) {
	const { buf } = image

	let iterations = 0

	map_image(image, (addr, x, y) => {
		if (buf[addr] === 0) {
			mouse(opts.x + x, opts.y + y)
			click()

			if (iterations < 1000) {
				delay(.5)
			} else {
				delay(500)
				iterations = 0
			}
			iterations++
		}
	})
}

const up_state = { fill: false }
const down_state = (left, y) => ({ fill: true, left, right: left, y })

function line_groups({ buf, width, height }) {
	const groups = []

	let state = up_state

	function commit() {
		groups.push([state.left, state.right, state.y])
		state = up_state
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const offset = (width * y + x) << 2
			const filled = buf[offset] === 0

			if (state.fill) {
				if (filled) {
					state.right++
				} else {
					commit()
				}
			} else {
				if (filled) {
					state = down_state(x, y)
				}
			}
		}

		if (state.fill) {
			commit()
		}
	}

	return groups
}

function line_draw(image) {
	const groups = line_groups(image)

	groups.forEach(([l, r, y], i) => {
		delay(i % 2000 === 0 ? 600 : 1)
		const ry = opts.y + y
		mouse(opts.x + l, ry)
		down()
		drag(opts.x + r, ry)
		up()
	})
}

read_png(file)
	.then(log_next)
	.then(image => contrast(image, opts.l))
	// .then(image => write_image(image, 'out.png'))
	// .then(pen_draw)
	.then(line_draw)
