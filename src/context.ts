import { BlueprintMappings } from './studio'
import { IBlueprintShowStyleBase, IBlueprintShowStyleVariant } from './showStyle'
import { ConfigItemValue } from './common'
import {
	IBlueprintSegmentLineDB,
	IBlueprintSegmentDB,
	IBlueprintRunningOrderDB,
	BlueprintRuntimeArguments,
	IBlueprintSegmentLineItem
} from './runningOrder'
import { IBlueprintAsRunLogEvent } from './asRunLog'
import { IngestRunningOrder, IngestPart } from './ingest'

/** Common */

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

/** Studio */

export interface IStudioConfigContext {
	/** Returns a map of the studio configs */
	getStudioConfig: () => {[key: string]: ConfigItemValue}
	/** Returns a reference to a studio config value, that can later be resolved in Core */
	getStudioConfigRef (configKey: string): string
}
export interface IStudioContext extends IStudioConfigContext {
	/** Get the mappings for the studio */
	getStudioMappings: () => BlueprintMappings
}

/** Show Style Base */

export interface IShowStyleBaseConfigContext {
	/** Get variants for this showStyleBase */
	getShowStyleVariants: (showStyleBaseId: string) => Array<IBlueprintShowStyleVariant>
	/** Translate the variant id to be the full id */
	getShowStyleVariantId: (showStyleBase: IBlueprintShowStyleBase, variantId: string) => string
}

/** Show Style Variant */

export interface IShowStyleConfigContext {
	/** Returns a map of the ShowStyle configs */
	getShowStyleConfig: () => {[key: string]: ConfigItemValue}
	/** Returns a reference to a showStyle config value, that can later be resolved in Core */
	getShowStyleConfigRef (configKey: string): string
}

export interface ShowStyleContext extends NotesContext, IStudioContext, IShowStyleConfigContext {
}

/** Running Order */

export interface RunningOrderContext extends ShowStyleContext {
	readonly runningOrderId: string
	readonly runningOrder: IBlueprintRunningOrderDB
}

export interface SegmentContext extends RunningOrderContext {
	getRuntimeArguments: (externalId: string) => BlueprintRuntimeArguments | undefined
}

export interface PartContext extends RunningOrderContext {
	getRuntimeArguments: () => BlueprintRuntimeArguments
}

/** Events */

export interface PartEventContext extends EventContext, RunningOrderContext {
	readonly part: IBlueprintSegmentLineDB
}

export interface EventContext {
	// TDB: Certain actions that can be triggered in Core by the Blueprint
}

export interface AsRunEventContext extends RunningOrderContext {
	readonly asRunEvent: IBlueprintAsRunLogEvent

	/** Get all asRunEvents in the runningOrder */
	getAllAsRunEvents (): Array<IBlueprintAsRunLogEvent>
	/** Get all segments in this runningOrder */
	getSegments (): Array<IBlueprintSegmentDB>
	/**
	 * Returns a segment
	 * @param id Id of segment to fetch. If omitted, return the segment related to this AsRunEvent
	 */
	getSegment (id?: string): IBlueprintSegmentDB | undefined

	/** Get all segmentLines in this runningOrder */
	getSegmentLines (): Array<IBlueprintSegmentLineDB>
	/**
	 * Returns a segmentLine.
	 * @param id Id of segmentLine to fetch. If omitted, return the segmentLine related to this AsRunEvent
	 */
	getSegmentLine (id?: string): IBlueprintSegmentLineDB | undefined
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

	/** Get the ingest data related to the runningOrder */
	getStoryForRunningOrder: () => IngestRunningOrder
	/** Get the ingest data related to a segmentLine */
	getStoryForSegmentLine (segmentLine: IBlueprintSegmentLineDB): IngestPart

	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string
}
