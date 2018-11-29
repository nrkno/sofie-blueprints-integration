import * as MOS from './copy/mos-connection'

import {
	IBlueprintRunningOrder,
	IBlueprintSegmentLine, IMessageBlueprintSegmentLine,
	IBlueprintSegmentLineItem, IBlueprintSegmentLineAdLibItem,
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

	onRunningOrderActivate?: (context: EventContext & RunningOrderContext) => void
	onRunningOrderFirstTake?: (context: EventContext & SegmentLineContext) => void
	onRunningOrderDeActivate?: (context: EventContext & RunningOrderContext) => void

	/** Called after a Take action */
	onPreTake?: (context: EventContext & SegmentContext) => void
	onPostTake?: (context: EventContext & SegmentContext) => void
	/** Called after an as-run event is created */
	onAsRunEvent?: (context: EventContext & MessageContext) => IBlueprintExternalMessageQueueObj[] | null
	/**
	 *
	 */
	// message: (
	// 	context: MessageContext,
	// 	runningOrder: IBlueprintRunningOrder,
	// 	takeSegmentLine: IBlueprintSegmentLine,
	// 	previousSegmentLine: IBlueprintSegmentLine | null
	// ) => IBlueprintExternalMessageQueueObj[] | null

}

export interface EventContext {
	// TDB: certain actions that can be triggered in Core by he blueprint
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

export interface RunningOrderContext extends ICommonContext, NotesContext {
	readonly runningOrderId: string
	readonly runningOrder: IBlueprintRunningOrder

	getStudioConfig: () => {[key: string]: ConfigItemValue}
	getShowStyleConfig: () => {[key: string]: ConfigItemValue}

}
export interface SegmentContext extends RunningOrderContext, NotesContext {
	readonly segment: IBlueprintSegment
	getSegmentLines: () => Array<IBlueprintSegmentLine>
}
export interface SegmentLineContext extends RunningOrderContext, NotesContext {
	readonly segmentLine: IBlueprintSegmentLine

	getRuntimeArguments: () => BlueprintRuntimeArguments

	// TODO - remove these getSegmentLine* as it could cause problems when moving a sl
	// getSegmentLines: () => Array<IBlueprintSegmentLine>
	/** Get the index number of this SegmentLine */
	getSegmentLineIndex: () => number
}

export interface MessageContext extends ICommonContext {
	getAllSegmentLines (): Array<IMessageBlueprintSegmentLine>
	getStoryForSegmentLine (segmentLine: IBlueprintSegmentLine): MOS.IMOSROFullStory
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
