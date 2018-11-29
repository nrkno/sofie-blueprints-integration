import { testClass } from './lib.spec'

import { MosTime } from '../MosTime'
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
		let v0 = new MosTime(new Date())
		let v1 = new OriginalMosTime(new Date())
		expect(v0.toString()).toEqual(v1.toString())
	}
})
