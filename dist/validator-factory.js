'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fieldValidator = require('./field-validator');

var _fieldValidator2 = _interopRequireDefault(_fieldValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ValidatorFactory {

	constructor(schema, field) {
		const instance = new _fieldValidator2.default(schema, field);
		return new Proxy(this, {
			get: function (className, validator) {
				return (arg1, arg2) => {
					let options, message;
					if (arg1 && arg1.message) {
						message = arg1.message;
					} else if (arg2 && arg2.message) {
						options = arg1;
						message = arg2.message;
					} else {
						options = arg1;
					}
					instance.addValidator(validator, options, message);
					return new ValidatorFactory(schema, field);
				};
			}
		});
	}

}
exports.default = ValidatorFactory;