import * as MOS from 'mos-connection'

import {
	IBlueprintRunningOrder,
	IBlueprintSegmentLine, IMessageBlueprintSegmentLine,
	IBlueprintSegmentLineItem, IBlueprintSegmentLineAdLibItem,
	BlueprintRuntimeArguments
} from './runningOrder'
import { IBlueprintExternalMessageQueueObj } from './message'
import { ConfigManifestEntry } from './config'

import { TimelineObject } from './timeline'

export interface BlueprintCollection {
	Baseline: (context: BaselineContext) => BaselineResult
	RunStory: (context: RunStoryContext, story: MOS.IMOSROFullStory) => StoryResult | null
	PostProcess: (context: PostProcessContext) => PostProcessResult
	Message: (context: MessageContext, runningOrder: IBlueprintRunningOrder, takeSegmentLine: IBlueprintSegmentLine, previousSegmentLine: IBlueprintSegmentLine | null) => IBlueprintExternalMessageQueueObj[] | null

	StudioConfigManifest: ConfigManifestEntry[]
	ShowStyleConfigManifest: ConfigManifestEntry[]

	Version: string
	MinimumCoreVersion: string
}

export interface ICommonContext {
	readonly runningOrder: IBlueprintRunningOrder

	getHashId: (stringToBeHashed?: string | number) => string
	unhashId: (hash: string) => string
	getLayer: (type: LayerType, key: string) => string // TODO - remove
	getStudioConfig: () => {[key: string]: string}
	getShowStyleConfig: () => {[key: string]: string}
	error: (message: string) => void
	warning: (message: string) => void
	getNotes: () => Array<any>
}

export interface BaselineContext extends ICommonContext {
}
export interface RunStoryContext extends ICommonContext {
	segmentLine: IBlueprintSegmentLine
	getRuntimeArguments: () => BlueprintRuntimeArguments

	// TODO - remove these getSegmentLine* as it could cause problems when moving a sl
	getSegmentLines: () => Array<IBlueprintSegmentLine>
	getSegmentLineIndex: () => number
}
export interface PostProcessContext extends ICommonContext {
	getSegmentLines: () => Array<IBlueprintSegmentLine>
}
export interface MessageContext extends ICommonContext {
	getCachedStoryForSegmentLine (segmentLine: IBlueprintSegmentLine): MOS.IMOSROFullStory
	getCachedStoryForRunningOrder: () => MOS.IMOSRunningOrder
	getAllSegmentLines (): Array<IMessageBlueprintSegmentLine>
	formatDateAsTimecode: (time: number) => string
	formatDurationAsTimecode: (time: number) => string
}

export interface BaselineResult {
	AdLibItems: IBlueprintSegmentLineAdLibItem[]
	BaselineItems: TimelineObject[]
}

export interface StoryResult {
	SegmentLine: IBlueprintSegmentLine
	SegmentLineItems: IBlueprintSegmentLineItem[]
	AdLibItems: IBlueprintSegmentLineAdLibItem[]
}

export interface PostProcessResult {
	SegmentLineItems: IBlueprintSegmentLineItem[]
}

export enum LayerType {
	Source,
	Output,
	LLayer
}
