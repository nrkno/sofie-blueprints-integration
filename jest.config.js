module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.jest.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js'
	},
	testMatch: [
		'**/__tests__/**/*.spec.(ts|js)'
	],
	testPathIgnorePatterns: [
		'integrationTests'
	],	
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
		  branches: 80,
		  functions: 100,
		  lines: 95,
		  statements: 90
		}
	},
	coverageDirectory: "./coverage/",
	collectCoverage: true
}
