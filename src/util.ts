import * as _ from 'underscore'
import * as crypto from 'crypto'

export function getHash (str: string): string {
	const hash = crypto.createHash('sha1')
	return hash.update(str).digest('base64').replace(/[\+\/\=]/g, '_') // remove +/= from strings, because they cause troubles
}
/**
 * Iterates deeply through object or array
 * @param obj the object or array to iterate through
 * @param iteratee function to apply on every attribute
 */
export function iterateDeeply (obj: any, iteratee: (val: any, key?: string | number) => (any | iterateDeeplyEnum), key?: string | number) {
	let newValue = iteratee(obj, key)
	if (newValue === iterateDeeplyEnum.CONTINUE) {
		// Continue iterate deeper if possible
		if (_.isObject(obj)) { // object or array
			_.each(obj, (val, key) => {
				obj[key] = iterateDeeply(val, iteratee, key)
			})
		} else {
			// don't change anything
		}
		return obj
	} else {
		return newValue
	}
}

export enum iterateDeeplyEnum {
	CONTINUE = '$continue'
}
