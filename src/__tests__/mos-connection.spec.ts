import * as _ from 'underscore'
import * as Original from 'mos-connection'
import * as Local from '../copy/mos-connection'

describe('mos-connection', () => {
	_.each(Local, (type: any, typeName: string) => {
		test('Enumarable type "' + typeName + '"', () => {
			let originalType = Original[typeName]
			if (_.isUndefined(type) && _.isUndefined(originalType)) {
				expect(1).toEqual(1)
			} else if (_.isFunction(type)) {
				expect(_.isFunction(originalType)).toBeTruthy()
			} else {
				expect(type).toMatchObject(originalType)
			}
		})
	})
})
