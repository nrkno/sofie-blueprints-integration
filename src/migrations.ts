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
	validate: (afterMigration: boolean) => boolean | string

	/** If true, this step can be run automatically, without prompting for user input */
	canBeRunAutomatically: boolean
	/** The migration script. This is the script that performs the updates.
	 * Input to the function is the result from the user prompt (for manual steps)
	 * The miggration script is optional, and may be omitted if the user is expected to perform the update manually
	 * @param result Input from the user query
	 */
	migrate?: (input: MigrationStepInputFilteredResult) => void
	/** Query user for input, used in manual steps */
	input?: Array<MigrationStepInput> | (() => Array<MigrationStepInput>)

	/** If this step depend on the result of another step. Will pause the migration before this step in that case. */
	dependOnResultFrom?: string
}
export interface MigrationStep extends MigrationStepBase {
	/** The version this Step applies to */
	version: string
}
