import { IBlueprintSegmentLine, IBlueprintSegmentLineItem } from './runningOrder'

import { Timeline } from 'timeline-state-resolver-types'

export { Timeline }

export enum PlayoutTimelinePrefixes {
	SEGMENT_LINE_GROUP_PREFIX = 'sl_group_',
	SEGMENT_LINE_GROUP_FIRST_ITEM_PREFIX = 'sl_group_firstobject_',
	SEGMENT_LINE_ITEM_GROUP_PREFIX = 'sli_group_',
	SEGMENT_LINE_ITEM_GROUP_FIRST_ITEM_PREFIX = 'sli_group_firstobject_'
}

export function getSlGroupId (sl: IBlueprintSegmentLine | string) {
	if (typeof sl === 'string') return PlayoutTimelinePrefixes.SEGMENT_LINE_GROUP_PREFIX + sl
	return PlayoutTimelinePrefixes.SEGMENT_LINE_GROUP_PREFIX + sl._id
}
export function getSliGroupId (sli: IBlueprintSegmentLineItem | string) {
	if (typeof sli === 'string') return PlayoutTimelinePrefixes.SEGMENT_LINE_ITEM_GROUP_PREFIX + sli
	return PlayoutTimelinePrefixes.SEGMENT_LINE_ITEM_GROUP_PREFIX + sli._id
}
export function getSlFirstObjectId (sl: IBlueprintSegmentLine | string) {
	if (typeof sl === 'string') return PlayoutTimelinePrefixes.SEGMENT_LINE_GROUP_FIRST_ITEM_PREFIX + sl
	return PlayoutTimelinePrefixes.SEGMENT_LINE_GROUP_FIRST_ITEM_PREFIX + sl._id
}
export function getSliFirstObjectId (sli: IBlueprintSegmentLineItem | string) {
	if (typeof sli === 'string') return PlayoutTimelinePrefixes.SEGMENT_LINE_ITEM_GROUP_FIRST_ITEM_PREFIX + sli
	return PlayoutTimelinePrefixes.SEGMENT_LINE_ITEM_GROUP_FIRST_ITEM_PREFIX + sli._id
}

export enum TimelineObjHoldMode {
	NORMAL = 0,
	ONLY = 1, // Only use when in HOLD
	EXCEPT = 2 // Only use when not in HOLD
}

export interface TimelineObjectCoreExt extends Timeline.TimelineObject {
	/** Restrict object usage according to whether we are currently in a hold */
	holdMode?: TimelineObjHoldMode
	/** Whether the object is abstract, and should not be routed to a playout device */
	isAbstract?: boolean
}
