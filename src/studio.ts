import {
	Mappings, Mapping
} from 'timeline-state-resolver-types'

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
}
