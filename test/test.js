import expect from 'chai';
import mongoose from 'mongoose';
mongoose.Promise = Promise;


describe('Array', function() {

	describe('#indexOf()', function() {

		it('should return -1 when the value is not present', function() {
			expect({ab: 1}).to.not.have.property('a');
			expect([1, 2]).to.be.an('array').that.does.not.include(3);
		});
	});

});
