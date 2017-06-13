'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _defaultErrors = require('./default-errors');

var _defaultErrors2 = _interopRequireDefault(_defaultErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FieldValidator {

	constructor(schema, field) {
		this._schema = schema;
		this._field = field;
	}

	getSchema() {
		return this._schema;
	}

	getField() {
		return this._field;
	}

	createPath() {
		return this.getSchema().path(this.getField());
	}

	addValidator(name, arg, message) {
		if (name in this) {
			return this[name](arg, message);
		}
		if (name in _validator2.default) {
			return this.useValidatorJS(name, arg, message);
		}
		throw new Error('Validator `' + name + '` does not exist');
	}

	useValidatorJS(name, args, message) {
		this.buildValidator({
			validator: function (value) {
				if (isEmpty(value)) {
					return true;
				}
				return _validator2.default[name](value, args);
			},
			message: message || _defaultErrors2.default[name]
		}, args);
	}

	required(args, message) {
		this.buildValidator({
			validator: function (value) {
				return !isEmpty(value);
			},
			message: message || this.getField() + ' is required'
		});
	}

	custom(fn, message) {
		this.buildValidator({
			validator: fn,
			message: message || this.getField() + ' is invalid'
		});
	}

	buildValidator(obj, args) {
		this.createPath().validate({
			isAsync: false,
			validator: obj.validator,
			message: interpolateMessage(obj.message, args)
		});
	}

}

exports.default = FieldValidator;
function interpolateMessage(message, args) {
	if (args === null || typeof args === 'undefined') {
		args = '';
	}
	if (typeof args === 'string') {
		args = [args];
	} else if (typeof args === 'object') {
		args = Object.values(args);
	}
	return message.replace(/{ARGS\[(\d+)\]}/g, (replace, argIndex) => {
		let val = args[argIndex];
		return typeof val !== 'undefined' ? val : '';
	});
}

function isEmpty(value) {
	return value === '' || value === null || typeof value === 'undefined';
}