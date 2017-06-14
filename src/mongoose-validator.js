import ValidatorFactory from './validator-factory';

class MongooseValidator {

	/**
	 * Create a new instance for schema validation
	 * @param schema
	 */
	constructor(schema) {
		if(schema.constructor.name !== 'Schema') {
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
		return new ValidatorFactory(
			this.getSchema(),
			fieldName
		);
	}

}

export default MongooseValidator;
