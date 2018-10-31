import * as MOS from 'tv-automation-mos-connection'

import {
	IBlueprintRunningOrder,
	IBlueprintSegmentLine, IMessageBlueprintSegmentLine,
	IBlueprintSegmentLineItem, IBlueprintSegmentLineAdLibItem
} from './runningOrder'
import { ExternalMessageQueueObj } from './message'

import { TimelineObject } from './timeline'

export interface BlueprintCollection {
	Baseline: (context: BaselineContext) => BaselineResult
	RunStory: (context: RunStoryContext, story: MOS.IMOSROFullStory) => StoryResult | null
	PostProcess: (context: PostProcessContext) => PostProcessResult
	Message: (context: MessageContext, runningOrder: IBlueprintRunningOrder, takeSegmentLine: IBlueprintSegmentLine, previousSegmentLine: IBlueprintSegmentLine | null) => ExternalMessageQueueObj[] | null
	Version: string
}

export interface ICommonContext {
	readonly runningOrder: IBlueprintRunningOrder

	getHashId: (stringToBeHashed?: string | number) => string
	unhashId: (hash: string) => string
	getLayer: (type: LayerType, key: string) => string // TODO - remove
	getConfig: () => IStudioConfigItem[]
	error: (message: string) => void
	warning: (message: string) => void
	getNotes: () => Array<any>
}

export interface BaselineContext extends ICommonContext {
}
export interface RunStoryContext extends ICommonContext {
	segmentLine: IBlueprintSegmentLine

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

export interface IStudioConfigItem {
	_id: string
	/** Value */
	value: string
}
