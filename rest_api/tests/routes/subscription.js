const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Test get subscriptions', function() {
	var requestResult;
	var response;

  before(function (done) {
    chai.request(`http://${config.hostName}:${config.hostPort}`)
      .get("/subscriptions")
      .end(function (err, res) {
        requestResult = res.body;
        response = res;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
    
  it('Should return an array of 4 objects', function () {
		expect(response).to.have.status(200);
		expect(response.body).to.have.length(4);
		expect(response).to.have.headers;
  });
    
	it('The first object in the array has known properties', function() {
    expect(requestResult[0]).to.have.property('id');
    expect(requestResult[0]).to.have.property('name');
    expect(requestResult[0]).to.have.property('cost');
		expect(response.body).to.not.be.a.string;
	});

	it('The elements in the array have the expected properties', function() {
		expect(response.body).to.satisfy(
			function (body) {
				for (var i = 0; i < body.length; i++) {
					expect(body[i]).to.have.property('id');
					expect(body[i]).to.have.property('name');
					expect(body[i]).to.have.property('cost');
				}
				return true;
			});
	});	
	
});