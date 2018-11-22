import * as _ from 'underscore'
import * as Original from 'mos-connection'
import * as Local from '../copy/mos-connection'

describe('mos-connection', () => {
	test('Enumarable types', () => {
		_.each(Local, (type: any, typeName: string) => {
			let originalType = Original[typeName]
			if (_.isFunction(type)) {
				expect(_.isFunction(originalType)).toBeTruthy()
			} else {
				expect(type).toMatchObject(originalType)
			}
		})
	})
})
