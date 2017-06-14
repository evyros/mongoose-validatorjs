import { expect } from 'chai';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

import MongooseValidator from '../src/mongoose-validator';
import defaultErrors from '../src/default-errors';

describe('Mongoose Validator', () => {
	let User, schema;

	before(done => {
		const url = 'mongodb://127.0.0.1/mongoose_validatorjs_test';
		const date = Date.now();

		const email = { type: String, default: null };
		const role = { type: String, default: null };
		const age = { type: Number, default: null };
		const date_created = { type: Date, default: date };

		mongoose.connect(url);

		schema = new mongoose.Schema({ email, role, age, date_created });
		User = mongoose.model('User', schema);
		done();
	});

	after(done => {
		mongoose.connection.db
			.dropDatabase()
			.then(() => {
				mongoose.disconnect().then(done, done);
			});
	});

	afterEach(done => {
		// Remove the attached validators from tests
		schema.paths.email.validators = [];
		schema.paths.role.validators = [];
		schema.paths.age.validators = [];
		schema.paths.date_created.validators = [];
		done();
	});

	describe('schema', () => {

		it('new instance', () => {
			let validate = new MongooseValidator(schema);
			expect(validate).to.have.property('_schema');
			expect(validate).to.be.an.instanceof(MongooseValidator);
		});

		it('provide bad schema object', () => {
			let fn = () => {
				const invalidSchema = {invalid: 'schema'};
				new MongooseValidator(invalidSchema); // eslint-disable-line no-new
			};
			expect(fn).to.throw();
		});

		it('get schema', () => {
			let validate = new MongooseValidator(schema);
			expect(validate.getSchema()).to.equal(schema);
		});

	});

	describe('field', () => {

		it('field', () => {
			let validate = new MongooseValidator(schema);
			expect(validate.field('email')).to.be.an('object');
		});

	});

	describe('required', () => {

		beforeEach(() => {
			let validate = new MongooseValidator(schema);
			validate.field('email').required();
		});

		describe('should raise an error when a required field is', () => {

			it('an empty string', () => {
				let model = new User({ email: '' });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
			});

			it('null', () => {
				let model = new User({ email: null });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
			});

			it('undefined', () => {
				let model = new User();
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
			});

		});

		describe('should raise no errors when a required field is filled with', () => {

			it('a string', () => {
				let model = new User({ email: 'email@gmail.com' });
				expect(model.validateSync()).to.be.undefined;
			});

			it('a number', () => {
				let model = new User({ email: 65 });
				expect(model.validateSync()).to.be.undefined;
			});

			it('a wrong type', () => {
				let model = new User({ email: new Date() });
				expect(model.validateSync()).to.be.undefined;
			});

		});

	});

	describe('validator.js', () => {

		let validate;

		beforeEach(() => {
			validate = new MongooseValidator(schema);
		});

		describe('isLength', () => {

			it('should raise no errors', () => {
				validate.field('email').isLength({ min: 15, max: 60 });
				let model = new User({ email: 'long.enough@email.com' });
				let error = model.validateSync();
				expect(error).to.be.undefined;
			});

			it('should raise an error', () => {
				validate.field('email').isLength({ min: 15, max: 60 });
				let model = new User({ email: 'short@ema.il' });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
			});

		});

		describe('isEmail', () => {

			beforeEach(() => {
				validate.field('email').isEmail();
			});

			describe('should raise no errors when', () => {

				it('email is valid', () => {
					let model = new User({ email: 'valid@email.com' });
					let error = model.validateSync();
					expect(error).to.be.undefined;
				});

				it('email is empty', () => {
					let model = new User({ email: '' });
					let error = model.validateSync();
					expect(error).to.be.undefined;
				});
			});

			describe('should raise an error when', () => {

				it('email is invalid', () => {
					let model = new User({ email: 'invalid email@gmail.com' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('email');
				});

				it('email is empty and required', () => {
					validate.field('email').required();
					let model = new User({ email: '' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('email');
				});

			});

		});

		describe('invalid validator', () => {

			it('should call to a validator does not exists', () => {
				let fn = () => {
					validate.field('email').invalidValidator();
				};
				expect(fn).to.throw();
			});

		});

	});

	describe('custom validator', () => {

		it('should fail validation', () => {
			let validate = new MongooseValidator(schema);
			validate.field('email').custom(value => value.length > 0);
			let model = new User({ email: '' });
			let error = model.validateSync();
			expect(error).to.not.be.undefined;
			expect(error.errors).to.have.property('email');
		});

		it('should pass validation', () => {
			let validate = new MongooseValidator(schema);
			validate.field('email').custom(value => value.length === 0);
			let model = new User({ email: '' });
			let error = model.validateSync();
			expect(error).to.be.undefined;
		});

	});

	describe('error messages', () => {

		describe('default message', () => {

			it('required', () => {
				let validate = new MongooseValidator(schema);
				validate.field('email').required();
				validateErrorMessage(new User(), 'email', 'email is required');
			});

			it('custom', () => {
				let validate = new MongooseValidator(schema);
				validate.field('email').custom(value => value.length > 0);
				validateErrorMessage(new User(), 'email', 'email is invalid');
			});

			it('validator.js', () => {
				let validate = new MongooseValidator(schema);
				validate.field('email').isEmail();
				let model = new User({ email: 'invalid.email$gmail.com' });
				validateErrorMessage(model, 'email', defaultErrors.isEmail);
			});

			it('validator.js + message interpolation', () => {
				let validate = new MongooseValidator(schema);
				validate.field('email').isLength({ min: 10, max: 60 });
				let model = new User({ email: 'too@short' });
				validateErrorMessage(model, 'email', 'Must be between 10 and 60 characters');
			});

		});

		describe('custom message', () => {

			// built-in validator
			it('required', () => {
				const customErrorMessage = 'Cannot be blank';
				let validate = new MongooseValidator(schema);
				validate.field('email').required({ message: customErrorMessage });
				validateErrorMessage(new User(), 'email', customErrorMessage);
			});

			it('custom validator', () => {
				const customErrorMessage = 'email should have at lease one character';
				let validate = new MongooseValidator(schema);
				validate.field('email').custom(
					value => value.length > 0,
					{ message: customErrorMessage }
				);
				validateErrorMessage(new User(), 'email', customErrorMessage);
			});

			it('validator.js without argument', () => {
				const customErrorMessage = 'The email you entered is not valid';
				let validate = new MongooseValidator(schema);
				validate.field('email').isEmail({ message: customErrorMessage });
				let model = new User({ email: 'invalid.email$gmail.com' });
				validateErrorMessage(model, 'email', customErrorMessage);
			});

			it('validator.js with 1 argument', () => {
				const customErrorMessage = 'the role does not exist';
				let validate = new MongooseValidator(schema);
				validate.field('role').isIn(['admin', 'guest'], { message: customErrorMessage });
				let model = new User({ role: 'invalidRole' });
				validateErrorMessage(model, 'role', customErrorMessage);
			});

			describe('custom message - message interpolation', () => {

				it('with an array argument', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}, {ARGS[1]}';
					let validate = new MongooseValidator(schema);
					validate.field('role').isIn(['admin', 'guest'], { message: customErrorMessage });
					let model = new User({ role: 'invalidRole' });
					validateErrorMessage(model, 'role', 'the provided role does not exist in admin, guest');
				});

				it('with a string argument', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidator(schema);
					validate.field('role').isWhitelisted('abcdefg', { message: customErrorMessage });
					let model = new User({ role: 'hijklmn' });
					validateErrorMessage(model, 'role', 'the provided role does not exist in abcdefg');
				});

				it('with a false argument', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidator(schema);
					validate.field('role').isWhitelisted(false, { message: customErrorMessage });
					let model = new User({ role: 'myRole' });
					validateErrorMessage(model, 'role', 'the provided role does not exist in ');
				});

				it('with an undefined argument', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidator(schema);
					let undefinedVariable;
					validate.field('role').isWhitelisted(undefinedVariable, { message: customErrorMessage });
					let model = new User({ role: 'myRole' });
					validateErrorMessage(model, 'role', 'the provided role does not exist in ');
				});

				it('with a null argument', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidator(schema);
					validate.field('role').isWhitelisted(null, { message: customErrorMessage });
					let model = new User({ role: 'myRole' });
					validateErrorMessage(model, 'role', 'the provided role does not exist in ');
				});

				it('with an object with an undefined argument', () => {
					const customErrorMessage = 'Must be between {ARGS[0]} and {ARGS[1]} characters';
					let validate = new MongooseValidator(schema);
					let undefinedVariable;
					validate.field('role').isLength({ min: 10, max: undefinedVariable }, { message: customErrorMessage });
					let model = new User({ role: 'short' });
					validateErrorMessage(model, 'role', 'Must be between 10 and  characters');
				});

			});

		});

	});

	describe('multiple validators chaining', () => {

		it('built-in validators', () => {
			let validate = new MongooseValidator(schema);
			validate.field('email')
				.required()
				.custom(value => value.length < 5);

			let model = new User({ email: 'long@email.com' });
			validateErrorMessage(model, 'email', 'email is invalid');

			let model2 = new User();
			validateErrorMessage(model2, 'email', 'email is required');
		});

		it('validator.js validators', () => {
			let validate = new MongooseValidator(schema);
			validate.field('email')
				.isEmail()
				.contains('name')
				.isLength({ min: 5, max: 10 });

			let model = new User({ email: 'invalidEmail' });
			validateErrorMessage(model, 'email', 'Invalid email');

			let model2 = new User({ email: 'valid@email.com' });
			validateErrorMessage(model2, 'email', 'Invalid characters');

			let model3 = new User({ email: 'name.too.long@email.com' });
			validateErrorMessage(model3, 'email', 'Must be between 5 and 10 characters');
		});

		it('mixed', () => {
			let validate = new MongooseValidator(schema);
			validate.field('email')
				.required()
				.isEmail()
				.contains('name');

			let model = new User();
			validateErrorMessage(model, 'email', 'email is required');

			let model2 = new User({ email: 'invalidEmail' });
			validateErrorMessage(model2, 'email', 'Invalid email');

			let model3 = new User({ email: 'valid@email.com' });
			validateErrorMessage(model3, 'email', 'Invalid characters');
		});

	});

	/**
	 * Util to validate an expected message
	 * @param model
	 * @param field
	 * @param expectedMessage
	 */
	function validateErrorMessage(model, field, expectedMessage) {
		let error = model.validateSync();
		expect(error).to.not.be.undefined;
		expect(error.errors).to.have.property(field);
		expect(error.errors[field].message).to.equal(expectedMessage);
	}

});
