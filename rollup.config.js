import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

var banner =
  '//  @hackages/object-mapper v' +
  pkg.version +
  '\n' +
  '//  https://github.com/hackages/object-mapper\n' +
  '//  (c) 2019-' +
  new Date().getFullYear() +
  ' Victor Bury\n' +
  '//  @hackages/object-mapper may be freely distributed under the MIT license.\n';

var input = './index.ts';

var config = {
  input: input,
  output: {
    format: 'umd',
    name: '@hackages/object-mapper',
    exports: 'named',
    banner: banner
  },
  plugins: [typescript()]
};

module.exports = config;
