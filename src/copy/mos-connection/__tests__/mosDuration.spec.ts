import { testClass } from './lib.spec'

import { MosDuration } from '../MosDuration'
import { MosDuration as OriginalMosDuration } from 'mos-connection'

describe('mos-connection MosDuration', () => {

	testClass([
		'01:25:32',
		'invalid format'
	], MosDuration, OriginalMosDuration, 'MosDuration', ['toString', 'valueOf'])

	test('MosDuration.toString', () => {
		expect(
			new MosDuration('01:25:32').toString()
		).toEqual(
			new OriginalMosDuration('01:25:32').toString()
		)
	})
})
