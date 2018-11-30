import { pad } from '../Utils'

import { pad as OriginalPad } from 'mos-connection/dist/utils/Utils'

describe('mos-connection Utils', () => {

	test('pad', () => {

		expect(
			pad('123', 5)
		).toEqual(
			OriginalPad('123', 5)
		)

		expect(
			pad('123', 5, 'a')
		).toEqual(
			OriginalPad('123', 5, 'a')
		)
	})
})
