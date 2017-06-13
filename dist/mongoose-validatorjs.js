'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _validatorFactory = require('./validator-factory');

var _validatorFactory2 = _interopRequireDefault(_validatorFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongooseValidatorjs {

	constructor(schema) {
		this._schema = schema;
	}

	getSchema() {
		return this._schema;
	}

	field(fieldName) {
		return new _validatorFactory2.default(this.getSchema(), fieldName);
	}

}

exports.default = MongooseValidatorjs;