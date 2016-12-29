const { PNG } = require('pngjs')
const { createReadStream: rs, createWriteStream: ws } = require('fs')

const read_png = file => new Promise((res, rej) =>
	rs(file)
		.pipe(new PNG)
		.on('parsed', function() {
			res({
				buf: this.data,
				height: this.height,
				width: this.width,
				stream: this
			})
		})
		.on('error', rej))

const write_image = (image, file) => image.stream.pack().pipe(ws(file))

const luminance = (r, g, b) => .2126 * r + .7152 * g + .0722 * b

function map_image({ buf, height, width }, mapping) {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const addr = (width * y + x) << 2
			mapping(addr, x, y)
		}
	}
}

function contrast(image, threshold) {
	const { buf } = image

	map_image(image, addr => {
		const r = buf[addr]
		const g = buf[addr + 1]
		const b = buf[addr + 2]
	
		const new_cmp = luminance(r, g, b) < threshold ? 0 : 255

		buf[addr] = new_cmp
		buf[addr + 1] = new_cmp
		buf[addr + 2] = new_cmp
	})

	return image
}

module.exports = {
	read_png,
	write_image,
	luminance,
	map_image,
	contrast
}
