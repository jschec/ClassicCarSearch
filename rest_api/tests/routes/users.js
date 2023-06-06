const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test post a new user', function () {
  var requestResult;
  var response;
  var getRequestResult;

  before(function (done) {
    var payload = JSON.stringify({
      "ssoID": "uniquessoID:xxxfff123456",
      "firstName": "Andyr",
      "lastName": "Rodriguez",
      "pictureUri": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      "email": "Jrodriguez66-test@gmail.com",
      "age": 16
    });
    chai.request(`https://${config.hostName}:${config.hostPort}`)
      .post("/api/users")
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function (err, res) {
        requestResult = res.body;
        response = res;
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it('Should return a user', function (done) {
    expect(response).to.have.status(201);
    expect(response.body.id).to.be.an('string');
    chai.request(`https://${config.hostName}:${config.hostPort}`)
      .get("/api/users/" + response.body.id)
      .end(function (err, res) {
        getRequestResult = res.body;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });

    it('compare post request body and get body', function () {
      expect(getRequestResult).to.include(requestResult);
    });

  });

  after('clean-up post test, delete created record',function (done) {
    
    chai.request(`https://${config.hostName}:${config.hostPort}`)
      .delete("/api/users/" + response.body.id)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      });
  });

});