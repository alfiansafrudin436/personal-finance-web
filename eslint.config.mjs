import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    // Each page owns its data loading in a colocated `hooks.ts`, which is the
    // architecture this project documents in docs/coding-standards.md. That
    // means an effect calls a loader which, once its request resolves, writes
    // the result to state. `set-state-in-effect` is inter-procedural and flags
    // every such loader at its call site, so it would reject client-side data
    // fetching outright rather than point at a fixable mistake. The loaders
    // themselves set no state synchronously, so the cascading render the rule
    // guards against does not happen here.
    files: ['src/app/**/hooks.ts', 'src/components/**/hooks.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);

export default eslintConfig;
