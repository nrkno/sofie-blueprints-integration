import { IBlueprintAsRunLogEvent } from './asRunLog'
import { ConfigItemValue } from './common'
import { IngestPart, IngestRundown } from './ingest'
import { IBlueprintExternalMessageQueueObj } from './message'
import {
	BlueprintRuntimeArguments,
	IBlueprintPartDB,
	IBlueprintPartInstance,
	IBlueprintPieceInstance,
	IBlueprintRundownDB,
	IBlueprintSegmentDB,
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

	error: (message: string, partExternalId?: string) => void
	warning: (message: string, partExternalId?: string) => void
}

/** Events */

// tslint:disable-next-line: no-empty-interface
export interface EventContext {
	// TDB: Certain actions that can be triggered in Core by the Blueprint
	getCurrentTime(): number
}

export interface PartEventContext extends EventContext, RundownContext {
	readonly part: Readonly<IBlueprintPartInstance>
}

export interface AsRunEventContext extends RundownContext {
	readonly asRunEvent: Readonly<IBlueprintAsRunLogEvent>

	formatDateAsTimecode(time: number): string
	formatDurationAsTimecode(time: number): string

	/** Get all asRunEvents in the rundown */
	getAllAsRunEvents(): Readonly<IBlueprintAsRunLogEvent[]>

	/** Get all unsent and queued messages in the rundown */
	getAllQueuedMessages(): Readonly<IBlueprintExternalMessageQueueObj[]>

	/** Originals */

	/** Get all segments in this rundown */
	getSegments(): Readonly<IBlueprintSegmentDB[]>
	/**
	 * Returns a segment
	 * @param id Id of segment to fetch. If omitted, return the segment related to this AsRunEvent
	 */
	getSegment(id?: string): Readonly<IBlueprintSegmentDB> | undefined

	/** Get all parts in this rundown */
	getParts(): Readonly<IBlueprintPartDB[]>

	/** Instances */

	/**
	 * Returns a partInstance.
	 * @param id Id of partInstance to fetch. If omitted, return the partInstance related to this AsRunEvent
	 */
	getPartInstance(id?: string): Readonly<IBlueprintPartInstance> | undefined
	/**
	 * Returns a pieceInstance.
	 * @param id Id of pieceInstance to fetch. If omitted, return the pieceInstance related to this AsRunEvent
	 */
	getPieceInstance(pieceInstanceId?: string): Readonly<IBlueprintPieceInstance> | undefined
	/**
	 * Returns pieces in a partInstance
	 * @param id Id of partInstance to fetch items in
	 */
	getPieceInstances(partInstanceId: string): Readonly<IBlueprintPieceInstance[]>

	/** Ingest Data */

	/** Get the ingest data related to the rundown */
	getIngestDataForRundown(): Readonly<IngestRundown> | undefined

	/** Get the ingest data related to a part */
	getIngestDataForPart(part: Readonly<IBlueprintPartDB>): Readonly<IngestPart> | undefined

	/** Get the ingest data related to a partInstance */
	getIngestDataForPartInstance(partInstance: Readonly<IBlueprintPartInstance>): Readonly<IngestPart> | undefined
}
