import { ConfigItemValue } from './common'

export enum ConfigManifestEntryType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	ENUM = 'enum'
}
export interface ConfigManifestEntry {
	id: string
	name: string
	description: string
	type: ConfigManifestEntryType
	options?: string[]
	required: boolean
	defaultVal: ConfigItemValue
}
