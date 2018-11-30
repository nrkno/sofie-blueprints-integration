import * as MOS from './copy/mos-connection'

import {
	IBlueprintRunningOrder,
	IBlueprintSegmentLine,
	IBlueprintSegmentLineItem,
	IBlueprintSegmentLineAdLibItem,
	BlueprintRuntimeArguments
} from './runningOrder'
import { IBlueprintExternalMessageQueueObj } from './message'
import { ConfigManifestEntry } from './config'

import { Timeline } from './timeline'
import { MigrationStep } from './migrations'
import { ConfigItemValue } from './common'
import {
	IBlueprintShowStyleBase,
	IBlueprintShowStyleVariant,
	IBlueprintSegment
} from './'
import { IBlueprintAsRunLogEvent } from './asRunLog'

export interface BlueprintManifest {

	// Manifest properties, to be used by Core

	/** Version of the blueprint */
	blueprintVersion: string
	/** Version of the blueprint-integration that the blueprint depend on */
	integrationVersion: string
	/** Version of the TSR-types that the blueprint depend on */
	TSRVersion: string
	/** Minimum expected version of the Sofie Core */
	minimumCoreVersion: string

	/** A list of config items this blueprint expects to be available on the Studio */
	studioConfigManifest: ConfigManifestEntry[]
	/** A list of config items this blueprint expects to be available on the ShowStyle */
	showStyleConfigManifest: ConfigManifestEntry[]

	/** A list of Migration steps related to a Studio */
	studioMigrations: MigrationStep[]
	/** A list of Migration steps related to a ShowStyle */
	showStyleMigrations: MigrationStep[]

	// --------------------------------------------------------------
	// Callbacks called by Core:

	/** Return which runningOrders */
	getRunningOrder?: (context: IStudioContext) => IBlueprintRunningOrder
	/** Returns the items used to build the baseline (default state) of a running order */
	getBaseline: (context: RunningOrderContext) => BaselineResult
	/** Convert a MOS-story into the SegmentLines of Sofie internal data structure
	 * Return the SegmentLine & the items in it
	 */
	getSegmentLine: (context: SegmentLineContext, story: MOS.IMOSROFullStory) => StoryResult | null
	/**
	 * Return SegmentLineItems to be added to SegmentLines in a Segment
	 */
	getSegmentPost: (context: SegmentContext) => PostProcessResult

	// Events

	onRunningOrderActivate?: (context: EventContext & RunningOrderContextPure) => void | Promise<void>
	onRunningOrderFirstTake?: (context: EventContext & SegmentLineContextPure) => void | Promise<void>
	onRunningOrderDeActivate?: (context: EventContext & RunningOrderContextPure) => void | Promise<void>

	/** Called after a Take action */
	onPreTake?: (context: EventContext & SegmentContextPure) => void | Promise<void>
	onPostTake?: (context: EventContext & SegmentContextPure) => void | Promise<void>
	/** Called after an as-run event is created */
	onAsRunEvent?: (context: EventContext & AsRunEventContext) => Promise<IBlueprintExternalMessageQueueObj[]>

}

export interface EventContext {
	// TDB: Certain actions that can be triggered in Core by the Blueprint
}

export interface IStudioContext {
	/** Get show styles available for this studio */
	getShowStyleBases: () => Array<IBlueprintShowStyleBase>
	/** Get variants for this showStyleBase */
	getVariants: (showStyleBaseId: string) => Array<IBlueprintShowStyleVariant>
}

export interface ICommonContext {
	/** Hash a string */
	getHashId: (stringToBeHashed?: string | number) => string
	/** Un-hash, is return the string that created the hash */
	unhashId: (hash: string) => string
}
export interface NotesContext {
	error: (message: string) => void
	warning: (message: string) => void
	getNotes: () => Array<any>
}

export interface RunningOrderContextPure extends ICommonContext {
	readonly runningOrderId: string
	readonly runningOrder: IBlueprintRunningOrder

	getStudioConfig: () => {[key: string]: ConfigItemValue}
	getShowStyleConfig: () => {[key: string]: ConfigItemValue}

}
export interface RunningOrderContext extends RunningOrderContextPure, NotesContext {
}
export interface SegmentContextPure extends RunningOrderContextPure {
	readonly segment: IBlueprintSegment
	getSegmentLines: () => Array<IBlueprintSegmentLine>
}
export interface SegmentContext extends SegmentContextPure, NotesContext {
}
export interface SegmentLineContextPure extends RunningOrderContextPure {
	readonly segmentLine: IBlueprintSegmentLine

	getRuntimeArguments: () => BlueprintRuntimeArguments

	// TODO - remove these getSegmentLine* as it could cause problems when moving a sl
	// getSegmentLines: () => Array<IBlueprintSegmentLine>
	/** Get the index number of this SegmentLine */
	getSegmentLineIndex: () => number
}
export interface SegmentLineContext extends SegmentLineContextPure, NotesContext {
}
export interface AsRunEventContext extends RunningOrderContextPure {
	readonly asRunEvent: IBlueprintAsRunLogEvent

	/** Get all asRunEvents in the runningOrder */
	getAllAsRunEvents (): Array<IBlueprintAsRunLogEvent>
	/** Get all segmentLines in this runningOrder */
	getSegmentLines (): Array<IBlueprintSegmentLine>
	/** Get the segmentLine related to thie AsRunEvent */
	getSegmentLine (): IBlueprintSegmentLine | undefined
	/** Get the mos story related to a segmentLine */
	getStoryForSegmentLine (segmentLine: IBlueprintSegmentLine): MOS.IMOSROFullStory
	/** Get the mos story related to the runningOrder */
	getStoryForRunningOrder: () => MOS.IMOSRunningOrder
	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string
}

export interface BaselineResult {
	adLibItems: IBlueprintSegmentLineAdLibItem[]
	baselineItems: Timeline.TimelineObject[]
}

export interface StoryResult {
	segmentLine: IBlueprintSegmentLine
	segmentLineItems: IBlueprintSegmentLineItem[]
	adLibItems: IBlueprintSegmentLineAdLibItem[]
}

export interface PostProcessResult {
	segmentLineItems: IBlueprintSegmentLineItem[]
}
