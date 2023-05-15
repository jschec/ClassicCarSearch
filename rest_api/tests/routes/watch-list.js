const chai = require('chai');
const chaiHttp = require('chai-http');

const config = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Test get watchlist by userid', function () {
    var requestResult;
    var response;

    before(function (done) {
        chai.request(`http://${config.hostName}:${config.hostPort}`)
            .get("/users/5e6da5a1-dd55-4661-8527-1b41473358ce/watchlist")
            .end(function (err, res) {
                requestResult = res.body;
                response = res;

                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Should return a watch list object containing the `id`, `user`, and `searches` fields.', function() {
        const expectedBody = {
            id: '3dcf7a54-a6c0-4360-8b77-ad5e52b7c57e',
            user: '5e6da5a1-dd55-4661-8527-1b41473358ce',
            searches: [
                '4a899638-05d4-46d4-9a6d-3d5508a2ff70',
                'b9f39223-33c9-4a59-89f2-51f4d53fc173',
                'b9f39223-33c9-4a59-89f2-51f4d53fc173',
                'a4927c4c-5bc8-49d1-9efe-f720ef027759',
                '7dd0b0e3-0e84-431b-b5d0-b2c3a30ee314',
                '5684dd2a-c975-4f47-bd6e-f0ee133a9ad3',
                '4a899638-05d4-46d4-9a6d-3d5508a2ff70',
                '5684dd2a-c975-4f47-bd6e-f0ee133a9ad3',
                '79fb50f8-c41f-4938-9a9a-4cf999e08ff7',
                '0ffacadf-eb56-4d5f-aee0-5a7d3b6bbbab'
            ],
        };
        expect(response.body).to.deep.include(expectedBody);
    });

});