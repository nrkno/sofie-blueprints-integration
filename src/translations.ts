export { TranslationsBundle, TranslationsBundleType, I18NextData }

enum TranslationsBundleType {
	/** i18next JSON data */
	I18NEXT = 'i18next',
}

interface I18NextData {
	[key: string]: string
}

/**
 * A bundle of translations
 */
interface TranslationsBundle {
	type: TranslationsBundleType
	/** language code (example: 'nb'), annotates what language the translations are for */
	language: string
	/** optional namespace for the bundle */
	namespace?: string
	/** encoding used for the data, typically utf-8 */
	encoding?: string
	/** the actual translations as key/value pairs */
	data: I18NextData
}
