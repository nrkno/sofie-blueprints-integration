export interface IngestRundown {
	externalId: string
	name: string

	type: string // something that identifies the data source, could be "spreadsheet", or "mos"

	payload?: any

	segments: IngestSegment[]
}
export interface IngestSegment {
	externalId: string
	name: string
	rank: number

	payload?: any
	parts: IngestPart[]
}
export interface IngestPart {
	externalId: string
	name: string // ??
	rank: number

	payload?: any
}
