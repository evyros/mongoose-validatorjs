import ValidatorFactory from './validator-factory';

class MongooseValidator {

	constructor(schema) {
		this._schema = schema;
	}

	getSchema() {
		return this._schema;
	}

	field(fieldName) {
		return new ValidatorFactory(
			this.getSchema(),
			fieldName
		);
	}

}

export default MongooseValidator;
