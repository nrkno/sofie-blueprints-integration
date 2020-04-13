export type Time = number

export interface IConfigItem {
	_id: string
	value: ConfigItemValue
}

export type ConfigItemValue = BasicConfigItemValue | TableConfigItemValue
export type TableConfigItemValue = Array<{
	_id: string
	[key: string]: BasicConfigItemValue
}>
export type BasicConfigItemValue = string | number | boolean | string[]
