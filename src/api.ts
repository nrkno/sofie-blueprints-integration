import { TSRTimelineObjBase } from 'timeline-state-resolver-types'

import {
	IBlueprintRundown,
	IBlueprintPiece,
	IBlueprintAdLibPiece,
	IBlueprintSegment,
	IBlueprintPart,
	IBlueprintPieceDB,
	IBlueprintRundownPlaylistInfo
} from './rundown'
import { IBlueprintExternalMessageQueueObj } from './message'
import { ConfigManifestEntry } from './config'

import { MigrationStep } from './migrations'
import { IngestRundown, IngestSegment } from './ingest'
import {
	IStudioContext,
	RundownContext,
	EventContext,
	PartEventContext,
	AsRunEventContext,
	SegmentContext,
	ShowStyleContext,
	IStudioConfigContext
} from './context'
import { IBlueprintShowStyleVariant, IBlueprintShowStyleBase } from './showStyle'
import { OnGenerateTimelineObj } from './timeline'

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

/** Key is the ID of the external ID of the Rundown, Value is the rank to be assigned */
export type OrderedRundowns = {
	[key: string]: number
}

export interface RundownPlaylistAndOrderedRundowns {
	playlist: IBlueprintRundownPlaylistInfo
	/** Returns information about the order of rundowns in a playlist, null will use natural sorting on rundown name */
	order: OrderedRundowns | null
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
	getShowStyleId: (context: IStudioConfigContext, showStyles: Array<IBlueprintShowStyleBase>, ingestRundown: IngestRundown) => string | null

	/** Returns information about the playlist this rundown is a part of, return null to not make it a part of a playlist */
	getRundownPlaylistInfo?: (rundowns: IBlueprintRundown[]) => RundownPlaylistAndOrderedRundowns | null
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

	/** Returns the id of the show style variant to use for a rundown, return null to ignore that rundown */
	getShowStyleVariantId: (context: IStudioConfigContext, showStyleVariants: Array<IBlueprintShowStyleVariant>, ingestRundown: IngestRundown) => string | null

	/** Generate rundown from ingest data. return null to ignore that rundown */
	getRundown: (context: ShowStyleContext, ingestRundown: IngestRundown) => BlueprintResultRundown

	/** Generate segment from ingest data */
	getSegment: (context: SegmentContext, ingestSegment: IngestSegment) => BlueprintResultSegment

	/** Generate Part from ingest data. If null, then getSegment is used instead */
	// TODO: Not used in core yet
	// getPart?: (context: PartContext, ingestPart: IngestPart) => BlueprintResultPart | null

	// Events

	onRundownActivate?: (context: EventContext & RundownContext) => Promise<void>
	onRundownFirstTake?: (context: EventContext & PartEventContext) => Promise<void>
	onRundownDeActivate?: (context: EventContext & RundownContext) => Promise<void>

	/** Called after a Take action */
	onPreTake?: (context: EventContext & PartEventContext) => Promise<void>
	onPostTake?: (context: EventContext & PartEventContext) => Promise<void>

	/** Called after the timeline has been generated, used to manipulate the timeline */
	onTimelineGenerate?: (context: EventContext & RundownContext, timeline: OnGenerateTimelineObj[], previousPartEndState: PartEndState | undefined, resolvedPieces: IBlueprintPieceDB[]) => Promise<OnGenerateTimelineObj[]>

	/** Called just before taking the next part. This generates some persisted data used by onTimelineGenerate to modify the timeline based on the previous part (eg, persist audio levels) */
	getEndStateForPart?: (context: RundownContext, previousEndState: PartEndState | undefined, activePieces: IBlueprintPiece[]) => PartEndState

	/** Called after an as-run event is created */
	onAsRunEvent?: (context: EventContext & AsRunEventContext) => Promise<IBlueprintExternalMessageQueueObj[]>

}

export type PartEndState = { [key: string]: any }

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
