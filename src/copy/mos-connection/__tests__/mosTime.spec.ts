import { testClass } from './lib.spec'

import { MosTime } from '../mosTime'
import { MosTime as OriginalMosTime } from 'mos-connection'

describe('mos-connection MosTime', () => {

	testClass([
		12345,
		'2018-01-02T04:05:06',
		'2018-01-02T04:05:06Z',
		'2018-01-02T04:05:06.123',
		'2018-01-02T04:05:06+2:00',
		'2018-01-02 04:05:06',
		'invalid timestamp',
		undefined,
		new MosTime('2018-01-02T04:05:06')
	], MosTime, OriginalMosTime, 'MosTime', ['toString', 'getTime'])

	test('MosDuration', () => {
		let d = new Date()
		let v0 = new MosTime(d)
		let v1 = new OriginalMosTime(d)
		expect(v0.toString()).toEqual(v1.toString())
	})
})
