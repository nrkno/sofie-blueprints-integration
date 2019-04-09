import { BlueprintMappings } from './studio'
import { IBlueprintShowStyleBase, IBlueprintShowStyleVariant } from './showStyle'
import { ConfigItemValue } from './common'
import { IBlueprintRunningOrder, IBlueprintSegment, IMessageBlueprintSegmentLine, BlueprintRuntimeArguments, IBlueprintSegmentLineItem } from './runningOrder'
import { IBlueprintAsRunLogEvent } from './asRunLog'
import { IngestRunningOrder, IngestPart } from './ingest'

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

	/** Get the ingest data related to the runningOrder */
	getStoryForRunningOrder: () => IngestRunningOrder
	/** Get the ingest data related to a segmentLine */
	getStoryForSegmentLine (segmentLine: IMessageBlueprintSegmentLine): IngestPart

	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string
}
