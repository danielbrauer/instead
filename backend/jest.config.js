const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.common')

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    automock: true,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
}