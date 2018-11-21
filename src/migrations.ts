import { BlueprintMapping } from './studio'
import { IBlueprintShowStyleVariant, ISourceLayer, IOutputLayer } from './showStyle'

export interface MigrationStepInput {
	stepId?: string // automatically filled in later
	label: string
	description?: string
	inputType: 'text' | 'multiline' | 'int' | 'checkbox' | 'dropdown' | 'switch' | null // EditAttribute types, null = dont display edit field
	attribute: string | null
	defaultValue?: any
}
export interface MigrationStepInputResult {
	stepId: string
	attribute: string
	value: any
}
export interface MigrationStepInputFilteredResult {
	[attribute: string]: any
}

export type ValidateStudio = (context: MigrationContextStudio, afterMigration: boolean) => boolean | string
export type ValidateShowStyle = (context: MigrationContextShowStyle, afterMigration: boolean) => boolean | string
export type ValidateCore = (afterMigration: boolean) => boolean | string
export type ValidateFunction = ValidateStudio | ValidateShowStyle | ValidateCore

export type MigrateStudio = (context: MigrationContextStudio, input: MigrationStepInputFilteredResult) => void
export type MigrateShowStyleBase = (context: MigrationContextShowStyle, input: MigrationStepInputFilteredResult) => void
export type MigrateCore = (input: MigrationStepInputFilteredResult) => void
export type MigrateFunction = MigrateStudio | MigrateShowStyleBase | MigrateCore

export interface MigrationContextStudio {
	getMapping: (id: string) => BlueprintMapping | undefined
	addMapping: (id: string, mapping: BlueprintMapping) => void
	updateMapping: (id: string, mapping: Partial<BlueprintMapping>) => void
	removeMapping: (id: string) => void

	getConfig: (id: string) => any | undefined
	setConfig: (id: string, value: any) => void
	removeConfig: (id: string) => void
}

export interface ShowStyleVariantPart { // TODO - is this needed or can it share base props with the main exposed interface?
	name: string
}

export interface MigrationContextShowStyle {
	getAllVariants: () => IBlueprintShowStyleVariant[]
	getVariant: (variantId: string) => IBlueprintShowStyleVariant | undefined
	addVariant: (variantId: string, variant: ShowStyleVariantPart) => void
	updateVariant: (variantId: string, variant: Partial<ShowStyleVariantPart>) => void
	removeVariant: (variantId: string) => void

	getBaseConfig: (id: string) => any | undefined
	setBaseConfig: (id: string, value: any) => void
	removeBaseConfig: (id: string) => void

	getSourceLayer: (id: string) => ISourceLayer | undefined
	addSourceLayer: (layer: ISourceLayer) => void
	updateSourceLayer: (id: string, layer: Partial<ISourceLayer>) => void
	removeSourceLayer: (id: string) => void

	getOutputLayer: (id: string) => IOutputLayer | undefined
	addOutputLayer: (layer: IOutputLayer) => void
	updateOutputLayer: (id: string, layer: Partial<IOutputLayer>) => void
	removeOutputLayer: (id: string) => void

	getVariantConfig: (variantId: string, id: string) => any | undefined
	setVariantConfig: (variantId: string, id: string, value: any) => void
	removeVariantConfig: (variantId: string, id: string) => void
}

export interface MigrationStepBase {
	/** Unique id for this step */
	id: string
	/** If this step overrides another step. Note: It's only possible to override steps in previous versions */
	overrideSteps?: Array<string>

	/** The validate function determines whether the step is to be applied
	 * (it can for example check that some value in the database is present)
	 * The function should return falsy if step is fullfilled (ie truthy if migrate function should be applied, return value could then be a string describing why)
	 * The function is also run after the migration-script has been applied (and should therefore return false if all is good)
	 */
	validate: ValidateFunction

	/** If true, this step can be run automatically, without prompting for user input */
	canBeRunAutomatically: boolean
	/** The migration script. This is the script that performs the updates.
	 * Input to the function is the result from the user prompt (for manual steps)
	 * The miggration script is optional, and may be omitted if the user is expected to perform the update manually
	 * @param result Input from the user query
	 */
	migrate?: MigrateFunction
	/** Query user for input, used in manual steps */
	input?: Array<MigrationStepInput> | (() => Array<MigrationStepInput>)

	/** If this step depend on the result of another step. Will pause the migration before this step in that case. */
	dependOnResultFrom?: string
}
export interface MigrationStep extends MigrationStepBase {
	/** The version this Step applies to */
	version: string
}
