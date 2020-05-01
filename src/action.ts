import { ConfigManifestEntry } from './config'
import { SomeContent } from './content'

export interface ActionUserData {
	[key: string]: any
}

export interface IBlueprintActionManifestDisplay {
	label: string
	description?: string

	// hotkeys?: string // maybe we should assume that triggers will exist for this to work?
	tags?: string[]
}

// I think we still need to allow specyfing sourceLayerId and outputLayerId for the actions,
// so that content-specific adlibs can be grouped together and approriate thumbnail
// handling applied on various types of lists
export interface IBlueprintActionManifestDisplayContent extends IBlueprintActionManifestDisplay {
	/** Source layer the timeline item belongs to */
	sourceLayerId: string
	/** Layer output this piece belongs to */
	outputLayerId: string
	/** Description used to produce the thumbnail, sourceDuration, etc. information for the adlib */
	content?: Omit<SomeContent, 'timelineObjects'>
}

export interface IBlueprintActionManifest {
	/** Id of the action */
	actionId: string
	/** Properties defining the action behaviour */
	userData: ActionUserData

	/** Used for segment-specific adlibs */
	segmentId?: string

	userDataManifest: {
		/** List of editable fields in userData, to allow for customising */
		editableFields?: ConfigManifestEntry[]
		// Example future options:
		// callActionrightAfterEdit: boolean,
		// asloDisplayACtionButton: boolean
	}

	display: IBlueprintActionManifestDisplay
}
