import { TSRTimelineObjBase } from 'timeline-state-resolver-types'

import { ConfigManifestEntry } from './config'
import { IBlueprintExternalMessageQueueObj } from './message'
import {
	IBlueprintAdLibPiece,
	IBlueprintPart,
	IBlueprintPiece,
	IBlueprintResolvedPieceInstance,
	IBlueprintRundown,
	IBlueprintRundownPlaylistInfo,
	IBlueprintSegment
} from './rundown'

import {
	AsRunEventContext,
	EventContext,
	IStudioConfigContext,
	IStudioContext,
	PartEventContext,
	RundownContext,
	SegmentContext,
	ShowStyleContext
} from './context'
import { IngestRundown, IngestSegment, IngestAdlib } from './ingest'
import { MigrationStep } from './migrations'
import { IBlueprintShowStyleBase, IBlueprintShowStyleVariant } from './showStyle'
import { OnGenerateTimelineObj } from './timeline'

export enum BlueprintManifestType {
	SYSTEM = 'system',
	STUDIO = 'studio',
	SHOWSTYLE = 'showstyle'
}

export interface BlueprintManifestSet {
	[id: string]: string
}
export type SomeBlueprintManifest = SystemBlueprintManifest | StudioBlueprintManifest | ShowStyleBlueprintManifest

export interface BlueprintManifestBase {
	blueprintType: BlueprintManifestType
	// Manifest properties, to be used by Core

	/** Unique id of the blueprint. This is used by core to check if blueprints are the same blueprint, but differing versions */
	blueprintId?: string
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

	/** Returns the items used to build the baseline (default state) of a studio, this is the baseline used when there's no active rundown */
	getBaseline: (context: IStudioContext) => TSRTimelineObjBase[]

	/** Returns the id of the show style to use for a rundown, return null to ignore that rundown */
	getShowStyleId: (
		context: IStudioConfigContext,
		showStyles: IBlueprintShowStyleBase[],
		ingestRundown: IngestRundown
	) => string | null

	/** Returns information about the playlist this rundown is a part of, return null to not make it a part of a playlist */
	getRundownPlaylistInfo?: (rundowns: IBlueprintRundown[]) => BlueprintResultRundownPlaylist | null
}

export interface ShowStyleBlueprintManifest extends BlueprintManifestBase {
	blueprintType: BlueprintManifestType.SHOWSTYLE

	/** A list of config items this blueprint expects to be available on the ShowStyle */
	showStyleConfigManifest: ConfigManifestEntry[]
	/** A list of Migration steps related to a ShowStyle */
	showStyleMigrations: MigrationStep[]

	// --------------------------------------------------------------
	// Callbacks called by Core:

	/** Returns the id of the show style variant to use for a rundown, return null to ignore that rundown */
	getShowStyleVariantId: (
		context: IStudioConfigContext,
		showStyleVariants: IBlueprintShowStyleVariant[],
		ingestRundown: IngestRundown
	) => string | null

	/** Generate rundown from ingest data. return null to ignore that rundown */
	getRundown: (context: ShowStyleContext, ingestRundown: IngestRundown) => BlueprintResultRundown

	/** Generate segment from ingest data */
	getSegment: (context: SegmentContext, ingestSegment: IngestSegment) => BlueprintResultSegment

	/** Generate adlib piece from ingest data */
	getAdlibItem?: (context: ShowStyleContext, ingestItem: IngestAdlib) => IBlueprintAdLibPiece | null

	// Events

	onRundownActivate?: (context: EventContext & RundownContext) => Promise<void>
	onRundownFirstTake?: (context: EventContext & PartEventContext) => Promise<void>
	onRundownDeActivate?: (context: EventContext & RundownContext) => Promise<void>

	/** Called after a Take action */
	onPreTake?: (context: EventContext & PartEventContext) => Promise<void>
	onPostTake?: (context: EventContext & PartEventContext) => Promise<void>

	/** Called after the timeline has been generated, used to manipulate the timeline */
	onTimelineGenerate?: (
		context: PartEventContext,
		timeline: OnGenerateTimelineObj[],
		previousPersistentState: TimelinePersistentState | undefined,
		previousPartEndState: PartEndState | undefined,
		resolvedPieces: IBlueprintResolvedPieceInstance[]
	) => Promise<BlueprintResultTimeline>

	/** Called just before taking the next part. This generates some persisted data used by onTimelineGenerate to modify the timeline based on the previous part (eg, persist audio levels) */
	getEndStateForPart?: (
		context: RundownContext,
		previousPersistentState: TimelinePersistentState | undefined,
		previousPartEndState: PartEndState | undefined,
		resolvedPieces: IBlueprintResolvedPieceInstance[],
		time: number
	) => PartEndState

	/** Called after an as-run event is created */
	onAsRunEvent?: (context: EventContext & AsRunEventContext) => Promise<IBlueprintExternalMessageQueueObj[]>
}

export interface PartEndState {
	[key: string]: any
}
export interface TimelinePersistentState {
	[key: string]: any
}

export interface BlueprintResultTimeline {
	timeline: OnGenerateTimelineObj[]
	persistentState: TimelinePersistentState
}

export interface BlueprintResultRundown {
	rundown: IBlueprintRundown
	globalAdLibPieces: IBlueprintAdLibPiece[]
	baseline: TSRTimelineObjBase[]
}
export interface BlueprintResultSegment {
	segment: IBlueprintSegment
	parts: BlueprintResultPart[]
}

export interface BlueprintResultPart {
	part: IBlueprintPart
	pieces: IBlueprintPiece[]
	adLibPieces: IBlueprintAdLibPiece[]
}

/** Key is the ID of the external ID of the Rundown, Value is the rank to be assigned */
export interface BlueprintResultOrderedRundowns {
	[rundownExternalId: string]: number
}

export interface BlueprintResultRundownPlaylist {
	playlist: IBlueprintRundownPlaylistInfo
	/** Returns information about the order of rundowns in a playlist, null will use natural sorting on rundown name */
	order: BlueprintResultOrderedRundowns | null
}
