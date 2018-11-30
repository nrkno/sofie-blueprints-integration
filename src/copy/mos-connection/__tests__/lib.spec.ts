export function testClass (values: Array<any>, Class0, Class1, name, extraKeys?: Array<string>) {

	for (let i in values) {
		let value = values[i]

		let v0
		try {
			v0 = new Class0(value)
		} catch (err0) {
			let err1
			try {
				let _tmp = new Class1(value)
			} catch (err) {
				err1 = err
			}
			expect(err0.toString()).toEqual(err1.toString())
			break
		}
		let v1 = new Class1(value)

		let keys = Object.keys(v0).concat(extraKeys || [])
		for (let k in keys) {
			let key = keys[k]

			let prop0 = v0[key]
			let prop1 = v1[key]

			test(`${name}.${key} for ${value}`, () => {
				if (typeof prop0 === 'function') {

					expect(typeof prop1).toEqual('function')

					try {
						let val0 = prop0()
						expect(val0).toEqual(prop1())
					} catch (err0) {
						let err1
						try {
							prop1()
						} catch (err) {
							err1 = err
						}
						expect(err0.toString()).toEqual(err1.toString())
					}
				} else {
					expect(
						prop0
					).toEqual(
						prop1
					)
				}
			})
		}
	}
}

test('lib placeholder', () => {
	expect(1).toEqual(1)
})
