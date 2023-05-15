const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test get watchlist by userid', function () {
    var response;

    before(function (done) {
        chai.request(`http://${config.hostName}:${config.hostPort}`)
            .get("/users/5e6da5a1-dd55-4661-8527-1b41473358ce/watchlist")
            .end(function (err, res) {
                response = res;

                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Should return a watch list object containing the `id`, `user`, and `searches` fields.', function() {
        const expectedData = fs.readFileSync('tests/routes/watchlist-expected.json');
        const expectedBody = JSON.parse(expectedData);

        expect(response.body).to.deep.include(expectedBody);
    });

});