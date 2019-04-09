import {
	IBlueprintRunningOrder,
	IBlueprintSegmentLineItem,
	IBlueprintSegmentLineAdLibItem,
	IBlueprintSegment,
	IBlueprintSegmentLine
} from './runningOrder'
import { IBlueprintExternalMessageQueueObj } from './message'
import { ConfigManifestEntry } from './config'

import { Timeline } from './timeline'
import { MigrationStep } from './migrations'
import { IngestRunningOrder, IngestSegment, IngestPart } from './ingest'
import { IStudioContext, PartContext, RunningOrderContext, EventContext, PartEventContext, AsRunEventContext, SegmentContext, ShowStyleContext, IStudioConfigContext } from './context'
import { IBlueprintShowStyleVariant, IBlueprintShowStyleBase } from './showStyle'

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

	/** Returns the items used to build the baseline (default state) of a studio, this is the baseline used when there's no active RO */
	getBaseline: (context: IStudioContext) => Timeline.TimelineObject[]

	/** Returns the id of the show style to use for a running order, return null to ignore that RO */
	getShowStyleId: (context: IStudioConfigContext, showStyles: Array<IBlueprintShowStyleBase>, ingestRunningOrder: IngestRunningOrder) => string | null
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

	/** Returns the id of the show style variant to use for a running order, return null to ignore that RO */
	getShowStyleVariantId: (context: IStudioConfigContext, showStyleVariants: Array<IBlueprintShowStyleVariant>, ingestRunningOrder: IngestRunningOrder) => string | null

	/** Generate runningOrder from ingest data. return null to ignore that RO */
	getRunningOrder: (context: ShowStyleContext, ingestRunningOrder: IngestRunningOrder) => BlueprintResultRunningOrder

	/** Generate segment from ingest data. return null to ignore that RO */
	getSegment: (context: SegmentContext, ingestSegment: IngestSegment) => BlueprintResultSegment | null

	/** Generate Part (segmentLine) from ingest data */
	getPart?: (context: PartContext, ingestPart: IngestPart) => BlueprintResultPart | null

	// Events

	onRunningOrderActivate?: (context: EventContext & RunningOrderContext) => Promise<void>
	onRunningOrderFirstTake?: (context: EventContext & PartEventContext) => Promise<void>
	onRunningOrderDeActivate?: (context: EventContext & RunningOrderContext) => Promise<void>

	/** Called after a Take action */
	onPreTake?: (context: EventContext & PartEventContext) => Promise<void>
	onPostTake?: (context: EventContext & PartEventContext) => Promise<void>

	/** Called after the timeline has been generated, used to manipulate the timeline */
	onTimelineGenerate?: (context: EventContext & RunningOrderContext, timeline: Timeline.TimelineObject[]) => Promise<Timeline.TimelineObject[]>

	/** Called after an as-run event is created */
	onAsRunEvent?: (context: EventContext & AsRunEventContext) => Promise<IBlueprintExternalMessageQueueObj[]>

}

export interface BlueprintResultRunningOrder {
	runningOrder: IBlueprintRunningOrder
	globalAdLibPieces: IBlueprintSegmentLineAdLibItem[]
	baseline: Timeline.TimelineObject[]
}
export interface BlueprintResultSegment {
	segment: IBlueprintSegment
	parts: BlueprintResultPart[]
}

export interface BlueprintResultPart {
	part: IBlueprintSegmentLine
	pieces: IBlueprintSegmentLineItem[]
	adLibPieces: IBlueprintSegmentLineAdLibItem[]
}
