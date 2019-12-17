var fs = require('fs');
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';

// Get a list of the directory names
const dirNames = fs
  .readdirSync('./', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

// Function to make a rollup config object from a directory name
function makeConfig(dir) {
  return {
    input: dir + '/main.js',
    external: [
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
    ],
    plugins: [
      commonjs({
        namedExports: { 'geotiff.js': ['GeoTIFF'] }
      }),
      json(),
      resolve(),
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      }),
      //  globals(),
      builtins(),
    ],
    output: {
      globals:{
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
      },
      file: dir + '/main.min.js',
      format: 'iife',
      name: 'app',
    }
  };
}

// Export an array of config objects
export default dirNames.map(makeConfig);
