const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test post a new user', function() {
	var requestResult;
	var response;

    before(function (done) {
        chai.request(`http://${config.hostName}:${config.hostPort}`)
          .post("/users")
          .send({
            "firstName": "Andres",
            "lastName": "Rodriguez",
            "pictureUri": "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
            "email": "Jrodriguez@gmail.com",
            "age": 106 })
          .end(function (err, res) {
            requestResult = res.body;
            response = res;
    
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
          });
      });


});