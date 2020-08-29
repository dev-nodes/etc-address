import pkg from './package.json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";

export default [
  {
    input: 'index.js',
    external: ['bip39', 'bip32', 'ethereumjs-util', "assert", "crypto"],
    output: [
      { file: pkg.main, format: 'cjs', exports: "auto" },
      { file: pkg.module, format: 'es', exports: "auto" }
    ],
    plugins: [json(), nodeResolve({ preferBuiltins: true }), commonjs()],
  }
]