// import { IConfigItem } from './common'
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

/** A set of available layer groups in a given installation */
export interface IBlueprintStudioInstallation {
	_id: string
	/** User-presentable name for the studio installation */
	name: string
	/** Mappings between the physical devices / outputs and logical ones */
	mappings: BlueprintMappings

	/** Config values are used by the Blueprints */
	// config: Array<IConfigItem>

	// runtimeArguments?: Array<IStudioRuntimeArgumentsItem>
}
