'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _validatorFactory = require('./validator-factory');

var _validatorFactory2 = _interopRequireDefault(_validatorFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongooseValidator {

	/**
  * Create a new instance for schema validation
  * @param schema
  */
	constructor(schema) {
		if (schema.constructor.name !== 'Schema') {
			throw Error('Invalid mongoose schema provided to MongooseValidator');
		}
		this._schema = schema;
	}

	/**
  * Get mongoose schema
  * @returns {Schema}
  */
	getSchema() {
		return this._schema;
	}

	/**
  * Set a validator for a schema field
  * @param fieldName
  * @returns {ValidatorFactory}
  */
	field(fieldName) {
		return new _validatorFactory2.default(this.getSchema(), fieldName);
	}

}

exports.default = MongooseValidator;