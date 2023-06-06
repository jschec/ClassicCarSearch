const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);
console.log(`https://${config.hostName}:${config.hostPort}`);

describe('Test get all subscriptions', function() {
	var requestResult;
	var response;

  before(function (done) {
    chai.request(`https://${config.hostName}:${config.hostPort}`)
      .get("/api/subscriptions")
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
    expect(response.body).to.be.an('array');
		expect(response.body).to.have.length(4);
		expect(response).to.have.headers;
  });
    
	it('The first object in the array has known properties', function() {
    expect(requestResult[0]).to.have.property('id');
    expect(requestResult[0].id).to.be.a('string');

    expect(requestResult[0]).to.have.property('name');
    expect(requestResult[0].name).to.be.a('string');

    expect(requestResult[0]).to.have.property('cost');
		expect(requestResult[0].cost).to.be.a('number');
	});

	it('The elements in the array have the expected properties', function() {
		expect(response.body).to.satisfy(
			function (body) {
				for (var i = 0; i < body.length; i++) {
					expect(body[i]).to.have.property('id');
          expect(body[i].id).to.be.a('string');

					expect(body[i]).to.have.property('name');
					expect(body[i].name).to.be.a('string');

          expect(body[i]).to.have.property('cost');
          expect(body[i].cost).to.be.a('number');
				}
				return true;
			});
	});	
});


describe('Test get single subscription', function() {
	var requestResult;
	var response;

  before(function (done) {
    chai.request(`https://${config.hostName}:${config.hostPort}`)
      .get("/api/subscriptions/0ff057d9-77bd-4aaf-933c-9a69da97840d")
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
    expect(requestResult.id).to.be.a('string');

    expect(requestResult).to.have.property('name');
    expect(requestResult.name).to.be.a('string');

    expect(requestResult).to.have.property('cost');
		expect(requestResult.cost).to.be.a('number');

    expect(response.body).to.not.be.a.string;
	});

  it('The object should have the expected body', function() {
    const expectedBody = {
      "name": "Basic",
      "features": [
          "Unlimited searches",
          "Ability to save and manage searches",
          "No advertisements"
      ],
      "cost": 10,
      "id": "0ff057d9-77bd-4aaf-933c-9a69da97840d"
    }

    expect(response.body).to.deep.include(expectedBody);
  });
});