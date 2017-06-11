import validatorJS from 'validator';
import defaultErrorMessages from './default-errors';

export class FieldValidator {

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

	addValidator(name, args, message) {
		if(name in this) {
			return this[name](message);
		}
		if(name in validatorJS) {
			return this.useValidatorJS(name, args, message);
		}
		throw new Error('Validator `' + name + '` does not exist');
	}

	useValidatorJS(name, args, message) {
		this.buildValidator({
			validator: function(value){
				if(isEmpty(value)) {
					return true;
				}
				return validatorJS[name](value, args);
			},
			message: message || defaultErrorMessages[name]
		}, args);
	}

	required(message) {
		this.buildValidator({
			validator: function(value){
				return ! isEmpty(value);
			},
			message: message || (this.getField() + ' is required')
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

function interpolateMessage(message, args) {
	if(args === null || typeof args === 'undefined') {
		args = '';
	}
	if(typeof args === 'string') {
		args = [args];
	}
	else if(typeof args === 'object') {
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
