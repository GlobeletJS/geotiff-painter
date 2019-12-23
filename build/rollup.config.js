import commonjs from 'rollup-plugin-commonjs';
//import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { glsl } from "./glsl-plugin.js";
import pkg from "../package.json";
import builtins from 'rollup-plugin-node-builtins';
//import globals from 'rollup-plugin-node-globals';

export default {
  input: 'src/main.js',
 /* external: [
    'babel-runtime/helpers/possibleConstructorReturn',
    'babel-runtime/helpers/inherits',
    'babel-runtime/regenerator',
    'babel-runtime/helpers/slicedToArray',
    'babel-runtime/helpers/asyncToGenerator',
    'babel-runtime/helpers/classCallCheck',
    'babel-runtime/helpers/createClass',
    'babel-runtime/helpers/typeof',
    'buffer',
    'fs',
    'http',
    'https',
    'url',
    'babel-runtime/helpers/toConsumableArray',
    'babel-runtime/helpers/toArray',
  ],*/
  plugins: [
    commonjs({
      namedExports: { 'geotiff.js': ['GeoTIFF'] }
    }),
    glsl(),
    resolve(),
  // babel({
    //  exclude: 'node_modules/**' // only transpile our source code
    //}),
    //  globals(),
    builtins(),
  ],
  output: {
    /*globals:{
      'babel-runtime/helpers/possibleConstructorReturn':'_possibleConstructorReturn3',
      'babel-runtime/helpers/inherits':'_inherits3',
      'babel-runtime/regenerator':'_regenerator2',
      'babel-runtime/helpers/slicedToArray':'_slicedToArray3',
      'babel-runtime/helpers/asyncToGenerator':'_asyncToGenerator3',
      'babel-runtime/helpers/classCallCheck':'_classCallCheck3',
      'babel-runtime/helpers/createClass':'_createClass3',
      'babel-runtime/helpers/typeof':'_typeof3',
      'buffer':'buffer',
      'fs':'fs',
      'http':'_http2',
      'https':'_https2',
      'url':'_url2',
      'babel-runtime/helpers/toConsumableArray':'_toConsumableArray3',
      'babel-runtime/helpers/toArray':'_toArray3',
    },*/
    file: pkg.main,
    //sourcemap: 'inline',
    format: 'esm',
    name: pkg.name,
  },
};
