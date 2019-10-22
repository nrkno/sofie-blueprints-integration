import { IBlueprintAsRunLogEvent } from './asRunLog'
import { ConfigItemValue } from './common'
import { IngestPart, IngestRundown } from './ingest'
import {
	BlueprintRuntimeArguments,
	IBlueprintPartDB,
	IBlueprintPiece,
	IBlueprintRundownDB,
	IBlueprintSegmentDB
} from './rundown'
import { BlueprintMappings } from './studio'

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
	getNotes: () => any[]
}

/** Studio */

export interface IStudioConfigContext {
	/** Returns a map of the studio configs */
	getStudioConfig: () => Readonly<{ [key: string]: ConfigItemValue }>
	/** Returns a reference to a studio config value, that can later be resolved in Core */
	getStudioConfigRef(configKey: string): string
}
export interface IStudioContext extends IStudioConfigContext {
	/** Get the mappings for the studio */
	getStudioMappings: () => Readonly<BlueprintMappings>
}

/** Show Style Variant */

export interface IShowStyleConfigContext {
	/** Returns a map of the ShowStyle configs */
	getShowStyleConfig: () => Readonly<{ [key: string]: ConfigItemValue }>
	/** Returns a reference to a showStyle config value, that can later be resolved in Core */
	getShowStyleConfigRef(configKey: string): string
}

export interface ShowStyleContext extends NotesContext, IStudioContext, IShowStyleConfigContext {}

/** Rundown */

export interface RundownContext extends ShowStyleContext {
	readonly rundownId: string
	readonly rundown: Readonly<IBlueprintRundownDB>
}

export interface SegmentContext extends RundownContext {
	getRuntimeArguments: (externalId: string) => Readonly<BlueprintRuntimeArguments> | undefined
}

export interface PartContext extends RundownContext {
	getRuntimeArguments: () => Readonly<BlueprintRuntimeArguments>
}

/** Events */

// tslint:disable-next-line: no-empty-interface
export interface EventContext {
	// TDB: Certain actions that can be triggered in Core by the Blueprint
}

export interface PartEventContext extends EventContext, RundownContext {
	readonly part: Readonly<IBlueprintPartDB>
}

export interface AsRunEventContext extends RundownContext {
	readonly asRunEvent: Readonly<IBlueprintAsRunLogEvent>

	/** Get the ingest data related to the rundown */
	getIngestDataForRundown: () => Readonly<IngestRundown> | undefined

	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string

	/** Get all asRunEvents in the rundown */
	getAllAsRunEvents(): Readonly<IBlueprintAsRunLogEvent[]>
	/** Get all segments in this rundown */
	getSegments(): Readonly<IBlueprintSegmentDB[]>
	/**
	 * Returns a segment
	 * @param id Id of segment to fetch. If omitted, return the segment related to this AsRunEvent
	 */
	getSegment(id?: string): Readonly<IBlueprintSegmentDB> | undefined

	/** Get all parts in this rundown */
	getParts(): Readonly<IBlueprintPartDB[]>
	/**
	 * Returns a part.
	 * @param id Id of part to fetch. If omitted, return the part related to this AsRunEvent
	 */
	getPart(id?: string): Readonly<IBlueprintPartDB> | undefined
	/**
	 * Returns a piece.
	 * @param id Id of piece to fetch. If omitted, return the piece related to this AsRunEvent
	 */
	getPiece(pieceId?: string): Readonly<IBlueprintPiece> | undefined
	/**
	 * Returns pieces in a part
	 * @param id Id of part to fetch items in
	 */
	getPieces(partId: string): Readonly<IBlueprintPiece[]>
	/** Get the ingest data related to a part */
	getIngestDataForPart(part: Readonly<IBlueprintPartDB>): Readonly<IngestPart> | undefined
}
