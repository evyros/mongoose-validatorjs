import { expect } from 'chai';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

describe('Mongoose Validator:', () => {
	let doc, User, schema;

	before(done => {
		const url = 'mongodb://127.0.0.1/mongoose_validatorjs_test';
		const date = Date.now();

		const name = { type: String, default: null };
		const interests = { type: Array, default: [] };
		const age = { type: Number, default: null };
		const date_created = { type: Date, default: date };

		mongoose.connect(url);

		schema = new mongoose.Schema({ name, interests, age, date_created });
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

	beforeEach(done => {
		User.create({}, (err, document) => {
			if (err) return done(err);
			if (!document) return done(new Error('No document found'));
			doc = document;
			return done();
		});
	});

	afterEach(done => {
		// Remove the attached validators from tests
		schema.paths.name.validators = [];
		schema.paths.interests.validators = [];
		schema.paths.age.validators = [];

		User.remove({}, err => {
			if (err) return done(err);
			return done();
		});
	});


	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			expect({ab: 1}).to.not.have.property('a');
			expect([1, 2]).to.be.an('array').that.does.not.include(3);
		});
	});

});
