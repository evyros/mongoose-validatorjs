import FieldValidator from './field-validator';

export default class ValidatorFactory {

	constructor(schema, field) {
		const instance = new FieldValidator(schema, field);
		return new Proxy(this, {
			get: function(className, validator) {
				return (arg1, arg2) => {
					let options, message;
					if(arg1 && arg1.message) {
						message = arg1.message;
					}
					else if(arg2 && arg2.message) {
						options = arg1;
						message = arg2.message;
					}
					else {
						options = arg1;
					}
					instance.addValidator(validator, options, message);
					return new ValidatorFactory(schema, field);
				};
			}
		});
	}

}

