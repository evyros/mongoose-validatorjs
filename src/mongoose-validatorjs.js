import ValidatorFactory from './validator-factory';

class MongooseValidatorjs {

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

export default MongooseValidatorjs;
