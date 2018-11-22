import { ConfigItemValue } from './common'

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
	defaultVal: ConfigItemValue
}
