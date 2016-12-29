const { resolve } = require('path')
const { readdirSync: ls } = require('fs')
const { contrast, map_image, read_png, write_image } = require('./image')
const { mouse, click, delay } = require('./automate')

const ifile = resolve('./pictures', ls('./pictures')[0])

read_png(ifile)
	.then(contrast)
	// .then(image => write_image(image, 'out.png'))
	.then(image => {
		const { buf } = image

		const ox = 300
		const oy = 300

		let iterations = 0

		map_image(image, (addr, x, y) => {
			if (buf[addr] === 0) {
				mouse(ox + x, oy + y)
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
	})
