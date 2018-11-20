
export enum ConfigManifestEntryType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean'
}
export enum ConfigManifestEntrySource {
	STUDIO = 'studio',
	SHOWSTYLE = 'showstyle'
}

export interface ConfigManifestEntry {
	id: string
	name: string
	description: string
	type: ConfigManifestEntryType
	source: ConfigManifestEntrySource
	required: boolean,
	defaultVal: number | string | boolean // TODO - type this?
}
