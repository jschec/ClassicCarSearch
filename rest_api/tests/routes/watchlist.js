const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test get watchlist by userid', function () {
    var response;

    before(function (done) {
        chai.request(`https://${config.hostName}:${config.hostPort}`)
            .get("/users/c07c3693-b054-4b6d-95f5-a8b6d715a631/watchlist")
            .end(function (err, res) {
                response = res;

                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('The first object in the array has known properties', function() {
      expect(response.body).to.be.an('object');

      expect(response.body).to.have.property('id');
      expect(response.body.id).to.be.a('string');
      
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.be.a('string');
  
      expect(response.body).to.have.property('searches');
      expect(response.body.searches).to.be.a('array');

      expect(response.body).to.have.property('createdAt');
      expect(response.body.createdAt).to.be.a('string');

      expect(response.body).to.have.property('updatedAt');
      expect(response.body.updatedAt).to.be.a('string');
    });
    

    it('Should return a watch list object containing the `id`, `user`, and `searches` fields.', function() {
        const expectedData = fs.readFileSync('tests/data/watchlist-expected.json');
        const expectedBody = JSON.parse(expectedData);

        expect(response.body).to.deep.include(expectedBody);
    });

});