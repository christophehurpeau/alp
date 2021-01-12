/* eslint-disable import/no-dynamic-require, prettier/prettier */

'use strict';

const production = process.env.NODE_ENV === 'production';
module.exports = require(`./dist/AlpNodeApp-node10${production ? '' : '-dev'}.cjs`);
