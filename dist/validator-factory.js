'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fieldValidator = require('./field-validator');

var _fieldValidator2 = _interopRequireDefault(_fieldValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ValidatorFactory {

	constructor(schema, field) {
		function handler(className, validator) {
			return (arg1, arg2) => {
				const instance = new _fieldValidator2.default(schema, field);

				let options, message;
				if (arg1 && arg1.message) {
					/*
      Validator with a custom message.
      Example: .required({ message: 'invalid' })
      */
					message = arg1.message;
				} else if (arg2 && arg2.message) {
					/*
      Validator with argument & custom message
      Example: .contains('seed', { message: 'no seed found' })
      */
					options = arg1;
					message = arg2.message;
				} else {
					/*
      Validator with argument
      Example: .isLength({ min: 0, max: 10 })
      */
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
exports.default = ValidatorFactory;