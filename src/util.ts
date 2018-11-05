import * as _ from 'underscore'

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
/**
 * Iterates deeply through object or array, using an asynchronous iteratee
 * @param obj the object or array to iterate through
 * @param iteratee function to apply on every attribute
 */
export async function iterateDeeplyAsync (obj: any, iteratee: (val: any, key?: string | number) => Promise<any | iterateDeeplyEnum>, key?: string | number) {
	let newValue = await iteratee(obj, key)
	if (newValue === iterateDeeplyEnum.CONTINUE) {
		// Continue iterate deeper if possible
		if (_.isObject(obj)) { // object or array
			await Promise.all(_.map(obj, async (val, key) => {
				obj[key] = await iterateDeeply(val, iteratee, key)
			}))
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
