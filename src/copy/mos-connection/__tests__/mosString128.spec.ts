import { testClass } from './lib.spec'

import { MosString128 } from '../MosString128'
import { MosString128 as OriginalMosString128 } from 'mos-connection'

describe('mos-connection MosString128', () => {

	testClass([
		'abc',
		'0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
		123,
		new MosString128('abc')
	], MosString128, OriginalMosString128, 'MosString128', ['toString', '_validate'])

	test('MosDuration', () => {
		let v0 = new MosString128('abc')
		let v1 = new OriginalMosString128('abc')
		expect(v0.toString()).toEqual(v1.toString())

		v0.string = 'asdf'
		v1.string = 'asdf'
		expect(v0.toString()).toEqual(v1.toString())

		v0.string = new MosString128('dfgh')
		v1.string = new MosString128('dfgh')
		expect(v0.toString()).toEqual(v1.toString())

		v0.string = { text: 'fgh' }
		v1.string = { text: 'fgh' }
		expect(v0.toString()).toEqual(v1.toString())

		v0.string = {}
		v1.string = {}
		expect(v0.toString()).toEqual(v1.toString())

		v0.string = { a: 'qwerty' }
		v1.string = { a: 'qwerty' }
		expect(v0.toString()).toEqual(v1.toString())
	})
})
