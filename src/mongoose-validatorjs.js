import { FieldValidator } from './field-validator';

class ValidatorFactory {

	constructor(schema, field) {
		const instance = new FieldValidator(schema, field);
		return new Proxy(this, {
			get: function(className, validator) {
				return (args, message) => {
					instance.addValidator(validator, args, message);
					return new ValidatorFactory(schema, field);
				};
			}
		});
	}

}

export class MongooseValidatorjs {

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
