// eslint-disable-next-line @typescript-eslint/no-var-requires
const babel = require('../../babel.config');

const presets = [...babel.presets, '@babel/preset-typescript'];
module.exports = { presets, plugins: babel.plugins };
