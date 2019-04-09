import { Time } from './common'
import { SomeContent } from './content'
import { Timeline } from './timeline'

/** The RunningOrder generated from Blueprint */
export interface IBlueprintRunningOrder {
	externalId: string
	/** Rundown slug - user-presentable name */
	name: string

	/** Expected start should be set to the expected time this running order should run on air */
	expectedStart?: Time
	/** Expected duration of the running order */
	expectedDuration?: number

	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}
}
/** The RunningOrder sent from Core */
export interface IBlueprintRunningOrderDB extends IBlueprintRunningOrder {
	_id: string

	/** Id of the showStyle variant used */
	showStyleVariantId: string
}

/** Collection of runtime arguments to apply */
export interface BlueprintRuntimeArguments {
	[key: string]: string
}

/** Base type of the runtime arguments */
export interface IBlueprintRuntimeArgumentsItem {
	_id: string
	label?: string
	hotkeys: string
	property: string
	value: string
}

export interface IBlueprintSegment {
	_id: string
	/** Position inside running order */
	_rank: number
	/** ID of the source object in the gateway */
	externalId: string
	/** The running order this segment belongs to */
	runningOrderId: string
	/** User-presentable name (Slug) for the Title */
	name: string
	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}
}
export interface IBlueprintSegmentLine {
	/** ID of the SegmentLine */
	_id: string
	externalId: string
	/** The story title */
	title: string
	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}

	/** Should this item should progress to the next automatically */
	autoNext?: boolean
	/** How much to overlap on when doing autonext */
	autoNextOverlap?: number
	/** How long to before this sl is ready to take over from the previous */
	prerollDuration?: number
	/** How long to before this sl is ready to take over from the previous (during transition) */
	transitionPrerollDuration?: number | null
	/** How long to keep the old sl alive during the transition */
	transitionKeepaliveDuration?: number | null
	/** How long the transition is active for */
	transitionDuration?: number | null
	/** Should we block a transition at the out of this SegmentLine */
	disableOutTransition?: boolean

	/** Expected duration of the line, in milliseconds */
	expectedDuration?: number

	/** The type of the segmentLiene, could be the name of the template that created it */
	typeVariant: string
	/** The subtype fo the segmentLine */
	subTypeVariant?: string

	/** Whether this segment line supports being used in HOLD */
	holdMode?: SegmentLineHoldMode

	updateStoryStatus?: boolean

	/** Classes to set on the TimelineGroupObj for this SL */
	classes?: string[]
	/** Classes to set on the TimelineGroupObj for the following SL */
	classesForNext?: string[]

	displayDurationGroup?: string
	displayDuration?: number

	/** When something bad has happened, we can mark the SL as invalid, which will prevent the user from TAKE:ing it */
	invalid?: boolean
}

export interface IMessageBlueprintSegmentLine extends IBlueprintSegmentLine {
	/** The segment ("Title") this line belongs to */
	segmentId: string

	/** Playout timings, in here we log times when playout happens */
	timings?: IMessageBlueprintSegmentLineTimings
}

export interface IMessageBlueprintSegmentLineTimings {
	/** Point in time the SegmentLine was taken, (ie the time of the user action) */
	take: Array<Time>
	/** Point in time the SegmentLine started playing (ie the time of the playout) */
	startedPlayback: Array<Time>
	/** Point in time the SegmentLine stopped playing (ie the time of the user action) */
	takeOut: Array<Time>
}
export enum SegmentLineHoldMode {
	NONE = 0,
	FROM = 1,
	TO = 2
}

/** A Single item in a "line": script, VT, cameras */
export interface IBlueprintSegmentLineItem {
	_id: string
	/** ID of the source object in the gateway */
	externalId: string
	/** The segment line this item belongs to - can be undefined for global ad lib segment line items */
	segmentLineId?: string
	/** User-presentable name for the timeline item */
	name: string
	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}

	/** Timeline item trigger. Possibly, most of these will be manually triggered as next, but maybe some will be automatic. */
	trigger: Timeline.TimelineTrigger
	/** Source layer the timeline item belongs to */
	sourceLayerId: string
  	/** Layer output this segment line item belongs to */
	outputLayerId: string
	/** Expected duration of the item as planned or as estimated by the system (in case of Script layers), in milliseconds. */
	expectedDuration: number | string
	virtual?: boolean
	/** The object describing the item in detail */
	content?: SomeContent
	/** The id of the item this item is a continuation of. If it is a continuation, the inTranstion must not be set, and trigger must be 0 */
	continuesRefId?: string

	isTransition?: boolean
	infiniteMode?: SegmentLineItemLifespan
	extendOnHold?: boolean

	/** Duration to preroll/overlap when running this sli as an adlib */
	adlibPreroll?: number
}
export interface IBlueprintSegmentLineAdLibItem {
	_rank: number
	/** ID of the source object in the gateway */
	externalId: string
	/** The segment line this item belongs to - can be undefined for global ad lib segment line items */
	segmentLineId?: string
	/** User-presentable name for the timeline item */
	name: string
	/** Arbitrary data storage for plugins */
	metaData?: {[key: string]: any}

	/** Source layer the timeline item belongs to */
	sourceLayerId: string
  	/** Layer output this segment line item belongs to */
	outputLayerId: string
	/** Expected duration of the item as planned or as estimated by the system (in case of Script layers), in milliseconds. */
	expectedDuration: number | string
	/** The object describing the item in detail */
	content?: SomeContent

	infiniteMode?: SegmentLineItemLifespan

	/** Duration to preroll/overlap when running this adlib */
	adlibPreroll?: number

	/** When something bad has happened, we can mark the AdLib as invalid, which will prevent the user from TAKE:ing it */
	invalid?: boolean
}

export enum SegmentLineItemLifespan {
	Normal = 0,
	OutOnNextSegmentLine = 1,
	OutOnNextSegment = 2,
	Infinite = 3
}
