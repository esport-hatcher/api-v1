module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>src/tests/setup.ts'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@utils$': '<rootDir>/src/lib/utils',
        '^@factories$': '<rootDir>/src/lib/factories',
        '^@models$': '<rootDir>/src/db/models',
        '^@services(.*)$': '<rootDir>/src/lib/services$1',
        '^@routes$': '<rootDir>/src/lib/routes',
        '^@config$': '<rootDir>/src/config',
        '^@tests(.*)$': '<rootDir>/src/tests$1',
        '^@app$': '<rootDir>/src/lib/app.ts',
        '^@middlewares$': '<rootDir>/src/lib/middlewares',
        '^@controllers$': '<rootDir>/src/lib/controllers',
        '^@db$': '<rootDir>/src/db/index.ts',
    },
};
