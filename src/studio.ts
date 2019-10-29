import { Mapping, Mappings } from 'timeline-state-resolver-types'

export enum LookaheadMode {
	NONE = 0,
	PRELOAD = 1,
	RETAIN = 2,
	WHEN_CLEAR = 3
}

export interface BlueprintMappings extends Mappings {
	[layerName: string]: BlueprintMapping
}
export interface BlueprintMapping extends Mapping {
	/** What method core should use to create lookahead objects for this layer */
	lookahead: LookaheadMode
	/** How many lookahead objects to create for this layer. Default = 1 */
	lookaheadDepth?: number
}
