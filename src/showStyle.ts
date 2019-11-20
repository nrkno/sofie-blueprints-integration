import { IConfigItem } from './common'
import { SourceLayerType } from './content'

export interface IBlueprintShowStyleBase {
	_id: string

	/** "Outputs" in the UI */
	outputLayers: Array<IOutputLayer>
	/** "Layers" in the GUI */
	sourceLayers: Array<ISourceLayer>

	/** Config values are used by the Blueprints */
	config: Array<IConfigItem>
}
export interface IBlueprintShowStyleVariant {
	_id: string
	name: string

	/** Config values are used by the Blueprints */
	config: Array<IConfigItem>
}

/** A single source layer, f.g Cameras, VT, Graphics, Remotes */
export interface ISourceLayer {
	_id: string
	/** Rank for ordering */
	_rank: number
	/** User-presentable name for the source layer */
	name: string
	/** Abbreviation for display in the countdown screens */
	abbreviation?: string
	type: SourceLayerType
	/** Source layer exclusivity group. When adLibbing, only a single piece can exist whitin an exclusivity group */
	exclusiveGroup?: string
	/** Use special treatment for remote inputs */
	isRemoteInput?: boolean
	/** Use special treatment for guest inputs */
	isGuestInput?: boolean
	/** Available shortcuts to be used for ad-lib items assigned to this sourceLayer - comma separated list allowing for chords (keyboard sequences) */
	activateKeyboardHotkeys?: string
	/** Single 'clear all from this sourceLayer' keyboard shortcut */
	clearKeyboardHotkey?: string
	/** Do global objects get to be assigned hotkeys? */
	assignHotkeysToGlobalAdlibs?: boolean
	/** Last used sticky item on a layer is remembered and can be returned to using the sticky hotkey */
	isSticky?: boolean
	/** Keyboard shortcut to be used to reuse a sticky item on this layer */
	activateStickyKeyboardHotkey?: string
	/** Should adlibs on this source layer be queueable */
	isQueueable?: boolean
	/** If set to true, the layer will be hidden from the user in Rundown View */
	isHidden?: boolean
	/** If set to true, items in the layer can be disabled by the user (the "G"-shortcut) */
	allowDisable?: boolean
	/** If set to true, items in this layer will be used for presenters screen display */
	onPresenterScreen?: boolean
}

/** A layer output group, f.g. PGM, Studio Monitor 1, etc. */
export interface IOutputLayer {
	_id: string
	/** User-presentable name for the layer output group */
	name: string
	/** Rank for ordering */
	_rank: number
	/** PGM treatment of this output should be in effect
	 * (generate PGM Clean out based on SourceLayer properties)
	 */
	isPGM: boolean
}
