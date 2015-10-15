var getBabelRelayPlugin = require('babel-relay-plugin');

var schema = require('../server/schema/compiled.json');

module.exports = getBabelRelayPlugin(schema.data);