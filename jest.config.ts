import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

const { config: tsconfig } = ts.readConfigFile(
'./tsconfig.json',
ts.sys.readFile,
);

const paths = tsconfig?.compilerOptions?.paths ?? {};

const config: Config = {
preset: 'ts-jest/presets/default-esm',
extensionsToTreatAsEsm: ['.ts'],
testEnvironment: 'node',
testRegex: '.*\\.spec\\.ts$',

transform: {
'^.+\\.tsx?$': [
'ts-jest',
{
useESM: true,
tsconfig: './tsconfig.spec.json',
},
],
},

moduleNameMapper: {
...pathsToModuleNameMapper(paths, {
prefix: '<rootDir>/',
}),
'^(\.{1,2}/.*)\.js$': '$1',
},

moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
