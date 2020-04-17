import { DeviceType } from 'timeline-state-resolver-types'
import { ConfigItemValue, TableConfigItemValue } from './common'
import { SourceLayerType } from './content'

export enum ConfigManifestEntryType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	ENUM = 'enum',
	TABLE = 'table',
	SELECT = 'select',
	SOURCE_LAYERS = 'source_layers',
	LAYER_MAPPINGS = 'layer_mappings'
}

export type BasicConfigManifestEntry =
	| ConfigManifestEntryString
	| ConfigManifestEntryNumber
	| ConfigManifestEntryBoolean
	| ConfigManifestEntryEnum
	| ConfigManifestEntrySelectFromOptions<true>
	| ConfigManifestEntrySelectFromOptions<false>
	| ConfigManifestEntrySourceLayers<true>
	| ConfigManifestEntrySourceLayers<false>
	| ConfigManifestEntryLayerMappings<true>
	| ConfigManifestEntryLayerMappings<false>

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

interface ConfigManifestEntrySelectBase<Multiple extends boolean> extends ConfigManifestEntryBase {
	defaultVal: Multiple extends true ? string[] : string
	multiple: Multiple
}

export interface ConfigManifestEntrySelectFromOptions<Multiple extends boolean>
	extends ConfigManifestEntrySelectBase<Multiple> {
	type: ConfigManifestEntryType.SELECT
	options: string[]
}

export interface ConfigManifestEntrySourceLayers<Multiple extends boolean>
	extends ConfigManifestEntrySelectBase<Multiple> {
	type: ConfigManifestEntryType.SOURCE_LAYERS
	filters?: {
		sourceLayerTypes?: SourceLayerType[]
	}
}
export interface ConfigManifestEntryLayerMappings<Multiple extends boolean>
	extends ConfigManifestEntrySelectBase<Multiple> {
	type: ConfigManifestEntryType.LAYER_MAPPINGS
	filters?: {
		deviceTypes?: DeviceType[]
	}
}
