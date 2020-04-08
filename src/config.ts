import { ConfigItemValue, TableConfigItemValue } from './common'

export enum ConfigManifestEntryType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	ENUM = 'enum',
	TABLE = 'table',
	SELECT = 'select',
}

export enum ConfigManifestSelectType {
	SOURCE_LAYERS = 'source_layers',
	LAYER_MAPPINGS = 'layer_mappings',
}

export type BasicConfigManifestEntry =
	| ConfigManifestEntryString
	| ConfigManifestEntryNumber
	| ConfigManifestEntryBoolean
	| ConfigManifestEntryEnum
	| ConfigManifestEntrySelect

export type ConfigManifestEntry = BasicConfigManifestEntry | ConfigManifestEntryTable

export interface ConfigManifestEntryBase {
	id: string
	name: string
	description: string
	type: ConfigManifestEntryType
	required: boolean
	defaultVal: ConfigItemValue
}
export interface ConfigManifestEntryString extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.STRING
	defaultVal: string
}
export interface ConfigManifestEntryNumber extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.NUMBER
	defaultVal: number
}
export interface ConfigManifestEntryBoolean extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.BOOLEAN
	defaultVal: boolean
}
export interface ConfigManifestEntryEnum extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.ENUM
	options: string[]
	defaultVal: string
}
export interface ConfigManifestEntryTable extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.TABLE
	columns: BasicConfigManifestEntry[]
	defaultVal: TableConfigItemValue
}
export interface ConfigManifestEntrySelect extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.SELECT
	selectType: ConfigManifestSelectType
	multiple: boolean
	defaultVal: string
}
