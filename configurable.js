const engine = require('./engine');
const defaults = require('./defaults');

module.exports = function(overrideOptions) {
  return engine({ ...defaults, ...overrideOptions });
};
