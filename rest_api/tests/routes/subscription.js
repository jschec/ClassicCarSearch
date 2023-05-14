const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test get all subscriptions', function() {
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


describe('Test get single subscription', function() {
	var requestResult;
	var response;

  before(function (done) {
    chai.request(`http://${config.hostName}:${config.hostPort}`)
      .get("/subscriptions/d3529038-9304-432c-b372-8bc9f391a257")
      .end(function (err, res) {
        requestResult = res.body;
        response = res;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
    
  it('Should return an object', function () {
		expect(response).to.have.status(200);
		expect(response.body).to.be.an('object');
		expect(response).to.have.headers;
  });
    
	it('The object in the array has known properties', function() {
    expect(requestResult).to.have.property('id');
    expect(requestResult).to.have.property('name');
    expect(requestResult).to.have.property('cost');
		expect(response.body).to.not.be.a.string;
	});
});