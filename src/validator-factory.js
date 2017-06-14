import FieldValidator from './field-validator';

export default class ValidatorFactory {

	constructor(schema, field) {
		function handler(className, validator) {
			return (arg1, arg2) => {
				const instance = new FieldValidator(schema, field);

				let options, message;
				if(arg1 && arg1.message) {
					// validator with custom message
					message = arg1.message;
				}
				else if(arg2 && arg2.message) {
					// validator with argument & custom message
					options = arg1;
					message = arg2.message;
				}
				else {
					// validator with argument
					options = arg1;
				}
				instance.addValidator(validator, options, message);
				return new ValidatorFactory(schema, field);
			};
		}

		return new Proxy(this, {
			get: handler
		});
	}

}

