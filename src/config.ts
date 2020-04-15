import { DeviceType } from 'timeline-state-resolver-types'
import { ConfigItemValue, TableConfigItemValue } from './common'
import { SourceLayerType } from './content'

export enum ConfigManifestEntryType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	ENUM = 'enum',
	TABLE = 'table',
	SOURCE_LAYERS = 'source_layers',
	LAYER_MAPPINGS = 'layer_mappings'
}

export type BasicConfigManifestEntry =
	| ConfigManifestEntryString
	| ConfigManifestEntryNumber
	| ConfigManifestEntryBoolean
	| ConfigManifestEntryEnum
	| ConfigManifestEntrySourceLayers
	| ConfigManifestEntryLayerMappings

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
	columns: Array<
		BasicConfigManifestEntry & {
			/** Column rank (left to right, lowest to highest) */
			rank: number
		}
	>
	defaultVal: TableConfigItemValue
}
export interface ConfigManifestEntrySourceLayers extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.SOURCE_LAYERS
	multiple: boolean
	filters?: {
		sourceLayerTypes?: SourceLayerType[]
	}
	defaultVal: string | string[]
}
export interface ConfigManifestEntryLayerMappings extends ConfigManifestEntryBase {
	type: ConfigManifestEntryType.LAYER_MAPPINGS
	multiple: boolean
	filters?: {
		deviceTypes?: DeviceType[]
	}
	defaultVal: string | string[]
}
