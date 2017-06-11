import { expect } from 'chai';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

import { MongooseValidatorjs } from '../src/mongoose-validatorjs';
import defaultErrors from '../src/default-errors';

describe('Mongoose Validator:', () => {
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
			let validate = new MongooseValidatorjs(schema);
			expect(validate).to.have.property('_schema');
			expect(validate).to.be.an.instanceof(MongooseValidatorjs);
		});

		it('get schema', () => {
			let validate = new MongooseValidatorjs(schema);
			expect(validate.getSchema()).to.equal(schema);
		});

	});

	describe('field', () => {

		it('field', () => {
			let validate = new MongooseValidatorjs(schema);
			expect(validate.field('email')).to.be.an('object');
		});

	});

	describe('required', () => {

		beforeEach(() => {
			let validate = new MongooseValidatorjs(schema);
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
				let error = model.validateSync();
				expect(error).to.be.undefined;
			});

			it('a number', () => {
				let model = new User({ email: 65 });
				let error = model.validateSync();
				expect(error).to.be.undefined;
			});

			it('a wrong type', () => {
				let model = new User({ email: new Date() });
				let error = model.validateSync();
				expect(error).to.be.undefined;
			});

		});

	});

	describe('validator.js', () => {

		let validate;

		beforeEach(() => {
			validate = new MongooseValidatorjs(schema);
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

	describe('error messages', () => {

		describe('default message', () => {

			it('required', () => {
				let validate = new MongooseValidatorjs(schema);
				validate.field('email').required();
				let model = new User();
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
				expect(error.errors.email.message).to.equal('email is required');
			});

			it('isEmail', () => {
				let validate = new MongooseValidatorjs(schema);
				validate.field('email').isEmail();
				let model = new User({ email: 'invalid.email$gmail.com' });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
				expect(error.errors.email.message).to.equal(defaultErrors.isEmail);
			});

			it('isLength (message interpolation)', () => {
				let validate = new MongooseValidatorjs(schema);
				validate.field('email').isLength({ min: 10, max: 60 });
				let model = new User({ email: 'too@short' });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
				expect(error.errors.email.message).to.equal('Must be between 10 and 60 characters');
			});

		});

		describe('custom message', () => {

			// built-in validator
			it('required', () => {
				const customErrorMessage = 'Cannot be blank';
				let validate = new MongooseValidatorjs(schema);
				validate.field('email').required({ message: customErrorMessage });
				let model = new User();
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
				expect(error.errors.email.message).to.equal(customErrorMessage);
			});

			// validator without arguments
			it('isEmail', () => {
				const customErrorMessage = 'The email you entered is not valid';
				let validate = new MongooseValidatorjs(schema);
				validate.field('email').isEmail({ message: customErrorMessage });
				let model = new User({ email: 'invalid.email$gmail.com' });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('email');
				expect(error.errors.email.message).to.equal(customErrorMessage);
			});

			// validator with 1 argument
			it('isIn', () => {
				const customErrorMessage = 'the role does not exist';
				let validate = new MongooseValidatorjs(schema);
				validate.field('role').isIn(['admin', 'guest'], { message: customErrorMessage });
				let model = new User({ role: 'invalidRole' });
				let error = model.validateSync();
				expect(error).to.not.be.undefined;
				expect(error.errors).to.have.property('role');
				expect(error.errors.role.message).to.equal(customErrorMessage);
			});

			describe('custom message - message interpolation', () => {

				it('isIn (with an array argument)', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}, {ARGS[1]}';
					let validate = new MongooseValidatorjs(schema);
					validate.field('role').isIn(['admin', 'guest'], { message: customErrorMessage });
					let model = new User({ role: 'invalidRole' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('role');
					expect(error.errors.role.message).to.equal('the provided role does not exist in admin, guest');
				});

				it('isWhitelisted (with a string argument)', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidatorjs(schema);
					validate.field('role').isWhitelisted('abcdefg', { message: customErrorMessage });
					let model = new User({ role: 'hijklmn' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('role');
					expect(error.errors.role.message).to.equal('the provided role does not exist in abcdefg');
				});

				it('isWhitelisted (with a false argument)', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidatorjs(schema);
					validate.field('role').isWhitelisted(false, { message: customErrorMessage });
					let model = new User({ role: 'myRole' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('role');
					expect(error.errors.role.message).to.equal('the provided role does not exist in ');
				});

				it('isWhitelisted (with an undefined argument)', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidatorjs(schema);
					let undefinedVariable;
					validate.field('role').isWhitelisted(undefinedVariable, { message: customErrorMessage });
					let model = new User({ role: 'myRole' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('role');
					expect(error.errors.role.message).to.equal('the provided role does not exist in ');
				});

				it('isWhitelisted (with a null argument)', () => {
					const customErrorMessage = 'the provided role does not exist in {ARGS[0]}';
					let validate = new MongooseValidatorjs(schema);
					validate.field('role').isWhitelisted(null, { message: customErrorMessage });
					let model = new User({ role: 'myRole' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('role');
					expect(error.errors.role.message).to.equal('the provided role does not exist in ');
				});

				it('isIn (with an object with an undefined argument)', () => {
					const customErrorMessage = 'Must be between {ARGS[0]} and {ARGS[1]} characters';
					let validate = new MongooseValidatorjs(schema);
					let undefinedVariable;
					validate.field('role').isLength({ min: 10, max: undefinedVariable }, { message: customErrorMessage });
					let model = new User({ role: 'short' });
					let error = model.validateSync();
					expect(error).to.not.be.undefined;
					expect(error.errors).to.have.property('role');
					expect(error.errors.role.message).to.equal('Must be between 10 and  characters');
				});

			});

		});

	});

});
