const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test post a new user', function() {
	var requestResult;
	var response;

  before(function (done) {
      chai.request(`https://${config.hostName}:${config.hostPort}`)
        .post("/api/users")
        .send({
          "ssoID": "jkjghdfgj",
          "firstName": "Andyr",
          "lastName": "Rodriguez",
          "pictureUri": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
          "email": "Jrodriguez66@gmail.com",
          "age": 16 })
        .end(function (err, res) {
          requestResult = res.body;
          response = res;
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
  });
  it('Shoulda body', function () {
		expect(response).to.have.status(201);
    expect(response.body_id).to.be.an('string');
    chai.request(`https://${config.hostName}:${config.hostPort}`)
    .get("/api/users/"+response.body._id)
    .end(function (err, res) {
      getrequestResult = res.body;
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
    it('compare post request body and get body', function () {
      expect(getrequestResult).to.include(requestResult);
    });

        
  });

  after(function (done) {
    //clean up
    chai.request(`https://${config.hostName}:${config.hostPort}`)
        .delete("/api/users/"+response.body._id)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(204);
          done();
        
      }); 
    }); 



});