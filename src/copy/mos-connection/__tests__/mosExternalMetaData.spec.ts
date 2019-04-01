import { testClass } from './lib.spec'

import {
	MosExternalMetaData,
	IMOSExternalMetaData,
	IMOSScope
} from '../mosExternalMetaData'
import {
	MosExternalMetaData as OriginalMosExternalMetaData,
	IMOSExternalMetaData as OriginalIMOSExternalMetaData,
	IMOSScope as OriginalIMOSScope
} from 'mos-connection/dist/dataTypes/mosExternalMetaData'

describe('mos-connection MosExternalMetaData', () => {

	let o: IMOSExternalMetaData = {
		MosScope: IMOSScope.OBJECT,
		MosSchema: 'asdf',
		MosPayload: {
			aa: 1,
			bb: {
				cc: '2'
			}
		}
	}

	let o2: OriginalIMOSExternalMetaData = {
		MosScope: OriginalIMOSScope.OBJECT,
		MosSchema: 'asdf',
		MosPayload: {
			aa: 1,
			bb: {
				cc: '2'
			}
		}
	}
	o2 = o2

	testClass([
		o
	], MosExternalMetaData, OriginalMosExternalMetaData, 'MosExternalMetaData', ['scope', 'schema', 'payload'])
})