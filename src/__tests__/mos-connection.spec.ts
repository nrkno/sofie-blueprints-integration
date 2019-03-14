import * as _ from 'underscore'
import * as Original from 'mos-connection'
import * as Local from '../copy/mos-connection'

describe('mos-connection', () => {
	let keys = _.filter(
		_.uniq(
			_.keys(Local).concat(_.keys(Original))
		),
	(key) => {
		// Filter out these, they are omitted in this copy
		return [
			'MosConnection',
			'ConnectionConfig',
			'MosDevice'
		].indexOf(key) === -1
	})

	_.each(keys, (typeName: string) => {
		test('Enumarable type "' + typeName + '"', () => {
			let type = (Local as any)[typeName]
			let originalType = (Original as any)[typeName]
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
