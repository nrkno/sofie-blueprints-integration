import { IBlueprintAsRunLogEvent } from './asRunLog'
import { IngestPart, ExtendedIngestRundown } from './ingest'
import { IBlueprintExternalMessageQueueObj } from './message'
import { OmitId } from './lib'
import {
	IBlueprintPart,
	IBlueprintPartDB,
	IBlueprintPartInstance,
	IBlueprintPiece,
	IBlueprintPieceInstance,
	IBlueprintResolvedPieceInstance,
	IBlueprintRundownDB,
	IBlueprintSegmentDB,
	IBlueprintMutatablePart,
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

	logDebug: (message: string) => void
	logInfo: (message: string) => void
	logWarning: (message: string) => void
	logError: (message: string) => void
}

export interface IUserNotesContext extends ICommonContext {
	userError: (message: string, params?: { [key: string]: any }) => void
	userWarning: (message: string, params?: { [key: string]: any }) => void
}

/** Studio */

export interface StudioContext extends ICommonContext {
	/** Returns the Studio blueprint config. If StudioBlueprintManifest.preprocessConfig is provided, a config preprocessed by that function is returned, otherwise it is returned unprocessed */
	getStudioConfig: () => unknown
	/** Returns a reference to a studio config value, that can later be resolved in Core */
	getStudioConfigRef(configKey: string): string
	/** Get the mappings for the studio */
	getStudioMappings: () => Readonly<BlueprintMappings>
}

export interface StudioUserContext extends IUserNotesContext, StudioContext {}

/** Show Style Variant */

export interface ShowStyleContext extends ICommonContext, StudioContext {
	/** Returns a ShowStyle blueprint config. If ShowStyleBlueprintManifest.preprocessConfig is provided, a config preprocessed by that function is returned, otherwise it is returned unprocessed */
	getShowStyleConfig: () => unknown
	/** Returns a reference to a showStyle config value, that can later be resolved in Core */
	getShowStyleConfigRef(configKey: string): string
}

export interface ShowStyleUserContext extends IUserNotesContext, ShowStyleContext {}

/** Rundown */

export interface RundownContext extends ShowStyleContext {
	readonly rundownId: string
	readonly rundown: Readonly<IBlueprintRundownDB>
}

export interface SegmentUserContext extends IUserNotesContext, RundownContext {
	userError: (message: string, params?: { [key: string]: any }, partExternalId?: string) => void
	userWarning: (message: string, params?: { [key: string]: any }, partExternalId?: string) => void
}

/** Actions */
export interface ActionExecutionContext extends IUserNotesContext, ShowStyleContext, EventContext {
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
	/** Update a piecesInstance */
	updatePieceInstance(pieceInstanceId: string, piece: Partial<OmitId<IBlueprintPiece>>): IBlueprintPieceInstance
	/** Insert a queued part to follow the current part */
	queuePart(part: IBlueprintPart, pieces: IBlueprintPiece[]): IBlueprintPartInstance
	/** Update a partInstance */
	updatePartInstance(part: 'current' | 'next', props: Partial<IBlueprintMutatablePart>): IBlueprintPartInstance

	/** Destructive actions */
	/** Stop any piecesInstances on the specified sourceLayers. Returns ids of piecesInstances that were affected */
	stopPiecesOnLayers(sourceLayerIds: string[], timeOffset?: number): string[]
	/** Stop piecesInstances by id. Returns ids of piecesInstances that were removed */
	stopPieceInstances(pieceInstanceIds: string[], timeOffset?: number): string[]
	/** Remove piecesInstances by id. Returns ids of piecesInstances that were removed. Note: For now we only allow removing from the next, but this might change to include current if there is justification */
	removePieceInstances(part: 'next', pieceInstanceIds: string[]): string[]

	/** Set flag to perform take after executing the current action. Returns state of the flag after each call. */
	takeAfterExecuteAction(take: boolean): boolean

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

export interface TimelineEventContext extends IUserNotesContext, EventContext, RundownContext {
	readonly currentPartInstance: Readonly<IBlueprintPartInstance> | undefined
	readonly nextPartInstance: Readonly<IBlueprintPartInstance> | undefined
}

export interface PartEventContext extends EventContext, RundownContext {
	readonly part: Readonly<IBlueprintPartInstance>
}

export interface AsRunEventContext extends RundownContext, EventContext {
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
	getIngestDataForRundown(): Readonly<ExtendedIngestRundown> | undefined

	/** Get the ingest data related to a part */
	getIngestDataForPart(part: Readonly<IBlueprintPartDB>): Readonly<IngestPart> | undefined

	/** Get the ingest data related to a partInstance */
	getIngestDataForPartInstance(partInstance: Readonly<IBlueprintPartInstance>): Readonly<IngestPart> | undefined
}
