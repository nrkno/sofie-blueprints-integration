import { BlueprintMappings } from './studio'
import { ConfigItemValue } from './common'
import {
	IBlueprintPartDB,
	IBlueprintSegmentDB,
	IBlueprintRundownDB,
	BlueprintRuntimeArguments,
	IBlueprintPiece
} from './rundown'
import { IBlueprintAsRunLogEvent } from './asRunLog'
import { IngestRundown, IngestPart } from './ingest'

/** Common */

export interface ICommonContext {
	/**
	 * Hash a string. Will return a unique string, to be used for all _id:s that are to be inserted in database
	 * @param originString A representation of the origin of the hash (for logging)
	 * @param originIsNotUnique If the originString is not guaranteed to be unique, set this to true
	 */
	getHashId: (originString: string, originIsNotUnique?: boolean) => string
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

/** Show Style Variant */

export interface IShowStyleConfigContext {
	/** Returns a map of the ShowStyle configs */
	getShowStyleConfig: () => {[key: string]: ConfigItemValue}
	/** Returns a reference to a showStyle config value, that can later be resolved in Core */
	getShowStyleConfigRef (configKey: string): string
}

export interface ShowStyleContext extends NotesContext, IStudioContext, IShowStyleConfigContext {
}

/** Rundown */

export interface RundownContext extends ShowStyleContext {
	readonly rundownId: string
	readonly rundown: IBlueprintRundownDB
}

export interface SegmentContext extends RundownContext {
	getRuntimeArguments: (externalId: string) => BlueprintRuntimeArguments | undefined
}

export interface PartContext extends RundownContext {
	getRuntimeArguments: () => BlueprintRuntimeArguments
}

/** Events */

export interface EventContext {
	// TDB: Certain actions that can be triggered in Core by the Blueprint
}

export interface PartEventContext extends EventContext, RundownContext {
	readonly part: IBlueprintPartDB
}

export interface AsRunEventContext extends RundownContext {
	readonly asRunEvent: IBlueprintAsRunLogEvent

	/** Get all asRunEvents in the rundown */
	getAllAsRunEvents (): Array<IBlueprintAsRunLogEvent>
	/** Get all segments in this rundown */
	getSegments (): Array<IBlueprintSegmentDB>
	/**
	 * Returns a segment
	 * @param id Id of segment to fetch. If omitted, return the segment related to this AsRunEvent
	 */
	getSegment (id?: string): IBlueprintSegmentDB | undefined

	/** Get all parts in this rundown */
	getParts (): Array<IBlueprintPartDB>
	/**
	 * Returns a part.
	 * @param id Id of part to fetch. If omitted, return the part related to this AsRunEvent
	 */
	getPart (id?: string): IBlueprintPartDB | undefined
	/**
	 * Returns a piece.
	 * @param id Id of piece to fetch. If omitted, return the piece related to this AsRunEvent
	 */
	getPiece (pieceId?: string): IBlueprintPiece | undefined
	/**
	 * Returns pieces in a part
	 * @param id Id of part to fetch items in
	 */
	getPieces (partId: string): Array<IBlueprintPiece>

	/** Get the ingest data related to the rundown */
	getIngestDataForRundown: () => IngestRundown | undefined
	/** Get the ingest data related to a part */
	getIngestDataForPart (part: IBlueprintPartDB): IngestPart | undefined

	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string
}
