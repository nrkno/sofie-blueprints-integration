import * as MOS from './copy/mos-connection'

import {
	IBlueprintRunningOrder,
	IBlueprintSegmentLineItem,
	IBlueprintSegmentLineAdLibItem,
	BlueprintRuntimeArguments,
	IMessageBlueprintSegmentLine,
	IBlueprintSegment,
	IBlueprintSegmentLine
} from './runningOrder'
import { IBlueprintExternalMessageQueueObj } from './message'
import { ConfigManifestEntry } from './config'

import { Timeline } from './timeline'
import { MigrationStep } from './migrations'
import { ConfigItemValue } from './common'
import {
	IBlueprintShowStyleBase,
	IBlueprintShowStyleVariant
} from './showStyle'
import { IBlueprintAsRunLogEvent } from './asRunLog'
import { BlueprintMappings } from './studio'

export enum BlueprintManifestType {
	SYSTEM = 'system',
	STUDIO = 'studio',
	SHOWSTYLE = 'showstyle'
}

export type BlueprintManifestSet = { [id: string]: string }
export type SomeBlueprintManifest = SystemBlueprintManifest | StudioBlueprintManifest | ShowStyleBlueprintManifest

export interface BlueprintManifestBase {
	blueprintType: BlueprintManifestType
	// Manifest properties, to be used by Core

	/** Version of the blueprint */
	blueprintVersion: string
	/** Version of the blueprint-integration that the blueprint depend on */
	integrationVersion: string
	/** Version of the TSR-types that the blueprint depend on */
	TSRVersion: string
	/** Minimum expected version of the Sofie Core */
	minimumCoreVersion: string
}

export interface SystemBlueprintManifest extends BlueprintManifestBase {
	blueprintType: BlueprintManifestType.SYSTEM

}

export interface StudioBlueprintManifest extends BlueprintManifestBase {
	blueprintType: BlueprintManifestType.STUDIO

	/** A list of config items this blueprint expects to be available on the Studio */
	studioConfigManifest: ConfigManifestEntry[]
	/** A list of Migration steps related to a Studio */
	studioMigrations: MigrationStep[]

	/** Returns the items used to build the baseline (default state) of a running order */
	getBaseline: (context: IStudioContext) => Timeline.TimelineObject[]

	/** Returns the id of the show style to use for a running order */
	getShowStyleVariantId: (context: IStudioContext, story: MOS.IMOSRunningOrder) => string | null
}

export interface ShowStyleBlueprintManifest extends BlueprintManifestBase {
	blueprintType: BlueprintManifestType.SHOWSTYLE

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
	getBaseline: (context: RunningOrderContext) => ShowStyleBaselineResult
	/** Convert a MOS-story into the SegmentLines of Sofie internal data structure
	 * Return the SegmentLine & the items in it
	 */
	getSegmentLine: (context: SegmentLineContext, story: MOS.IMOSROFullStory) => StoryResult | null
	/**
	 * Return SegmentLineItems to be added to SegmentLines in a Segment
	 */
	getSegmentPost: (context: SegmentContext) => PostProcessResult

	// Events

	onRunningOrderActivate?: (context: EventContext & RunningOrderContext) => Promise<void>
	onRunningOrderFirstTake?: (context: EventContext & SegmentLineContext) => Promise<void>
	onRunningOrderDeActivate?: (context: EventContext & RunningOrderContext) => Promise<void>

	/** Called after a Take action */
	onPreTake?: (context: EventContext & SegmentLineContext) => Promise<void>
	onPostTake?: (context: EventContext & SegmentLineContext) => Promise<void>
	/** Called after an as-run event is created */
	onAsRunEvent?: (context: EventContext & AsRunEventContext) => Promise<IBlueprintExternalMessageQueueObj[]>

}

export interface EventContext {
	// TDB: Certain actions that can be triggered in Core by the Blueprint
}

export interface IStudioContext extends IStudioConfigContext {
	/** Get the mappings for the studio */
	getStudioMappings: () => BlueprintMappings
	/** Get show styles available for this studio */
	getShowStyleBases: () => Array<IBlueprintShowStyleBase>
	/** Get variants for this showStyleBase */
	getShowStyleVariants: (showStyleBaseId: string) => Array<IBlueprintShowStyleVariant>
	/** Translate the variant id to be the full id */
	getShowStyleVariantId: (showStyleBase: IBlueprintShowStyleBase, variantId: string) => string
}

export interface ICommonContext {
	/** Hash a string */
	getHashId: (stringToBeHashed?: string | number) => string
	/** Un-hash, is return the string that created the hash */
	unhashId: (hash: string) => string
}
export interface NotesContext extends ICommonContext {
	error: (message: string) => void
	warning: (message: string) => void
	getNotes: () => Array<any>
}

export interface IStudioConfigContext {
	/** Returns a map of the studio configs */
	getStudioConfig: () => {[key: string]: ConfigItemValue}
	/** Returns a reference to a studio config value, that can later be resolved in Core */
	getStudioConfigRef (configKey: string): string
}

export interface RunningOrderContext extends NotesContext, IStudioConfigContext {
	readonly runningOrderId: string
	readonly runningOrder: IBlueprintRunningOrder

	/** Returns a map of the ShowStyle configs */
	getShowStyleConfig: () => {[key: string]: ConfigItemValue}
	/** Returns a reference to a showStyle config value, that can later be resolved in Core */
	getShowStyleConfigRef (configKey: string): string

}
export interface SegmentContext extends RunningOrderContext {
	readonly segment: IBlueprintSegment
	getSegmentLines: () => Array<IMessageBlueprintSegmentLine>
}
export interface SegmentLineContext extends RunningOrderContext {
	readonly segmentLine: IMessageBlueprintSegmentLine

	getRuntimeArguments: () => BlueprintRuntimeArguments

	/** Return true if segmentLine is the first in the Segment */
	getIsFirstSegmentLine: () => boolean
	/** Return true if segmentLine is the last in the Segment */
	getIsLastSegmentLine: () => boolean
}
export interface AsRunEventContext extends RunningOrderContext {
	readonly asRunEvent: IBlueprintAsRunLogEvent

	/** Get all asRunEvents in the runningOrder */
	getAllAsRunEvents (): Array<IBlueprintAsRunLogEvent>
	/** Get all segments in this runningOrder */
	getSegments (): Array<IBlueprintSegment>
	/**
	 * Returns a segment
	 * @param id Id of segment to fetch. If omitted, return the segment related to this AsRunEvent
	 */
	getSegment (id?: string): IBlueprintSegment | undefined

	/** Get all segmentLines in this runningOrder */
	getSegmentLines (): Array<IMessageBlueprintSegmentLine>
	/**
	 * Returns a segmentLine.
	 * @param id Id of segmentLine to fetch. If omitted, return the segmentLine related to this AsRunEvent
	 */
	getSegmentLine (id?: string): IMessageBlueprintSegmentLine | undefined
	/**
	 * Returns a segmentLineItem.
	 * @param id Id of segmentLineItem to fetch. If omitted, return the segmentLineItem related to this AsRunEvent
	 */
	getSegmentLineItem (segmentLineItemId?: string): IBlueprintSegmentLineItem | undefined
	/**
	 * Returns segmentLineItems in a segmentLine
	 * @param id Id of segmentLine to fetch items in
	 */
	getSegmentLineItems (segmentLineId: string): Array<IBlueprintSegmentLineItem>

	/** Get the mos story related to the runningOrder */
	getStoryForRunningOrder: () => MOS.IMOSRunningOrder
	/** Get the mos story related to a segmentLine */
	getStoryForSegmentLine (segmentLine: IMessageBlueprintSegmentLine): MOS.IMOSROFullStory

	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string
}

export interface ShowStyleBaselineResult {
	adLibItems: IBlueprintSegmentLineAdLibItem[]
	baselineItems: Timeline.TimelineObject[]
}

export interface StoryResult {
	segmentLine: IBlueprintSegmentLine
	segmentLineItems: IBlueprintSegmentLineItem[]
	adLibItems: IBlueprintSegmentLineAdLibItem[]
}

export type IBlueprintPostProcessSegmentLine = Pick<IBlueprintSegmentLine, '_id' | 'displayDurationGroup'>

export interface PostProcessResult {
	segmentLineItems: IBlueprintSegmentLineItem[]
	segmentLineUpdates: IBlueprintPostProcessSegmentLine[]
}
