import { IBlueprintAsRunLogEvent } from './asRunLog'
import { ConfigItemValue } from './common'
import { IngestPart, IngestRundown } from './ingest'
import { OmitId } from './lib'
import {
	BlueprintRuntimeArguments,
	IBlueprintPart,
	IBlueprintPartDB,
	IBlueprintPartInstance,
	IBlueprintPiece,
	IBlueprintPieceInstance,
	IBlueprintResolvedPieceInstance,
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

/** Actions */

export interface ActionExecutionContext extends ShowStyleContext {
	/** Data fetching */
	// getIngestRundown(): IngestRundown // TODO - for which part?
	/** Get a PartInstance which can be modified */
	getPartInstance(part: 'current' | 'next'): IBlueprintPartInstance | undefined
	/** Get the PieceInstances for a modifiable PartInstance */
	getPieceInstances(part: 'current' | 'next'): IBlueprintPieceInstance[]
	/** Get the resolved PieceInstances for a modifiable PartInstance */
	getResolvedPieceInstances(part: 'current' | 'next'): IBlueprintResolvedPieceInstance[]
	/** Get the last active piece on given layer */
	findLastPieceOnLayer(
		sourceLayerId: string,
		options?: {
			excludeCurrentPart?: boolean
			originalOnly?: boolean
			pieceMetaDataFilter?: any // Mongo query against properties inside of piece.metaData
		}
	): IBlueprintPieceInstance | undefined
	/** Fetch the showstyle config for the specified part */
	// getNextShowStyleConfig(): Readonly<{ [key: string]: ConfigItemValue }>

	/** Creative actions */
	/** Insert a piece. Returns id of new PieceInstance. Any timelineObjects will have their ids changed, so are not safe to reference from another piece */
	insertPiece(part: 'current' | 'next', piece: IBlueprintPiece): IBlueprintPieceInstance
	/** Update a piecesInstances */
	updatePieceInstance(pieceInstanceId: string, piece: Partial<OmitId<IBlueprintPiece>>): IBlueprintPieceInstance
	/** Insert a queued part to follow the current part */
	queuePart(part: IBlueprintPart, pieces: IBlueprintPiece[]): IBlueprintPartInstance

	/** Destructive actions */
	/** Stop any piecesInstances on the specified sourceLayers. Returns ids of piecesInstances that were affected */
	stopPiecesOnLayers(sourceLayerIds: string[], timeOffset?: number): string[]
	/** Stop piecesInstances by id. Returns ids of piecesInstances that were removed */
	stopPieceInstances(pieceInstanceIds: string[], timeOffset?: number): string[]

	/** Misc actions */
	// updateAction(newManifest: Pick<IBlueprintAdLibActionManifest, 'description' | 'payload'>): void // only updates itself. to allow for the next one to do something different
	// executePeripheralDeviceAction(deviceId: string, functionName: string, args: any[]): Promise<any>
	// openUIDialogue(message: string) // ?????
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
