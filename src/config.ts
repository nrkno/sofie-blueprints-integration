
export enum ConfigManifestEntryType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean'
}
export interface ConfigManifestEntry {
	id: string
	name: string
	description: string
	type: ConfigManifestEntryType
	required: boolean,
	defaultVal: number | string | boolean // TODO - type this?
}
