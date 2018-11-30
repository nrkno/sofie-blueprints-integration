export interface IBlueprintAsRunLogEvent {
	studioId: string,
	runningOrderId: string,
	segmentId?: string,
	segmentLineId?: string,
	segmentLineItemId?: string,
	timelineObjectId?: string

	/** Name/id of the content */
	content: string
	/** Name/id of the sub-content */
	content2?: string
	/** Metadata about the content */
	metadata?: any

	/** Timestamp of the event */
	timestamp: number
	/** If the event was done in rehersal */
	rehersal: boolean,
}
