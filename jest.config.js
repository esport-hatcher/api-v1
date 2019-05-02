module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	setupFilesAfterEnv: ['<rootDir>src/tests/setup.ts'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	moduleNameMapper: {
		'^@utils(.*)$': '<rootDir>/src/utils$1',
		'^@factories(.*)$': '<rootDir>/src/factories$1',
		'^@models(.*)$': '<rootDir>/src/models$1',
		'^@services(.*)$': '<rootDir>/src/services$1',
		'^@routes(.*)$': '<rootDir>/src/routes$1',
		'^@config(.*)$': '<rootDir>/src/config$1',
		'^@tests(.*)$': '<rootDir>/src/tests$1',
		'^@app(.*)$': '<rootDir>/src/app.ts$1',
		'^@middlewares(.*)$': '<rootDir>/src/middlewares$1',
		'^@controllers(.*)$': '<rootDir>/src/controllers$1'
	}
};
