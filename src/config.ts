
export enum ConfigManifestEntryType {
	STRING,
	NUMBER,
	BOOLEAN
}

export interface ConfigManifestEntry {
	id: string
	name: string
	description: string
	type: ConfigManifestEntryType
	required: boolean,
	defaultVal: any // TODO - type this?
}
