import { ConfigManifestEntry } from './config'
import { SourceLayerType } from './content'

export interface ActionUserData {
	[key: string]: any
}

export interface IBlueprintActionManifest {
	/** Id of the action */
	actionId: string
	/** Properties defining the action behaviour */
	userData: ActionUserData

	userDataManifest: {
		/** List of editable fields in userData, to allow for customising */
		editableFields?: ConfigManifestEntry[]
		// Example future options:
		// callActionrightAfterEdit: boolean,
		// asloDisplayACtionButton: boolean
	}

	display: {
		label: string
		description?: string

		sourceLayerType: SourceLayerType
		hotkeys?: string // ??
		tags?: string[]
		// TODO - whatever properties are wanted for the ui
		// identifier / tags / grouping?
		// source layer type of some sort?
	}
}
