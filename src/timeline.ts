import {
	IBlueprintPartDB,
	IBlueprintPiece
} from './rundown'

import { Timeline, TSRTimelineObjBase } from 'timeline-state-resolver-types'

export { Timeline }

export enum PlayoutTimelinePrefixes {
	PART_GROUP_PREFIX = 'part_group_',
	PART_GROUP_FIRST_ITEM_PREFIX = 'part_group_firstobject_',
	PIECE_GROUP_PREFIX = 'piece_group_',
	PIECE_GROUP_FIRST_ITEM_PREFIX = 'piece_group_firstobject_'
}

export function getPartGroupId (part: IBlueprintPartDB | string) {
	if (typeof part === 'string') return PlayoutTimelinePrefixes.PART_GROUP_PREFIX + part
	return PlayoutTimelinePrefixes.PART_GROUP_PREFIX + part._id
}
export function getPieceGroupId (piece: IBlueprintPiece | string) {
	if (typeof piece === 'string') return PlayoutTimelinePrefixes.PIECE_GROUP_PREFIX + piece

	return PlayoutTimelinePrefixes.PIECE_GROUP_PREFIX + piece._id
}
export function getPartFirstObjectId (part: IBlueprintPartDB | string) {
	if (typeof part === 'string') return PlayoutTimelinePrefixes.PART_GROUP_FIRST_ITEM_PREFIX + part
	return PlayoutTimelinePrefixes.PART_GROUP_FIRST_ITEM_PREFIX + part._id
}
export function getPieceFirstObjectId (piece: IBlueprintPiece | string) {
	if (typeof piece === 'string') return PlayoutTimelinePrefixes.PIECE_GROUP_FIRST_ITEM_PREFIX + piece

	return PlayoutTimelinePrefixes.PIECE_GROUP_FIRST_ITEM_PREFIX + piece._id
}

export enum TimelineObjHoldMode {
	NORMAL = 0,
	ONLY = 1, // Only use when in HOLD
	EXCEPT = 2 // Only use when not in HOLD
}

export interface TimelineObjectCoreExt extends TSRTimelineObjBase {
	/** Restrict object usage according to whether we are currently in a hold */
	holdMode?: TimelineObjHoldMode
	/** Whether the object is abstract, and should not be routed to a playout device */
	// isAbstract?: boolean // TODO - is this needed with the defined type=empty etc??
}
