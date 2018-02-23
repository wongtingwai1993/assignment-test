'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../app.js'); // Our app
var emailUtil = require('../utils/EmailValidator')

describe('test valid email', () => {
    it("email should be valid", function () {
        expect(emailUtil.validateEmail('test@gmail.com')).equal(true);
    })
})

describe('test invalid email', () => {
    it("email should be invalid", function () {
        expect(emailUtil.validateEmail('tasdasdsad')).equal(false);
    })
})

describe('test invalid email length', () => {
    it("email should be invalid", function () {
        expect(emailUtil.validateEmail('isadfjoisdjfiosjfoiasjdfiosajdfiojsdiofjsidofsiodfjiosdjfiosdjsoisdjfiosdjfiosajdfiosjadfidasjofijdsaifojsadifojsdifdsiofjsoiadjfiosadjfisjfiosadjfiodsjfoisjdjdsiofjasdiofjiosadjfiosdjfisodjf@gmail.com')).equal(false);
    })
})

// may fail if no student under specify teacher (status will be 204)
describe('/GET specify students by specifying teacher', () => {
    it('should return all students', function () {
        return chai.request(app)
            .get('/api/commonstudents?teacher=teacherken2%40gmail.com')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
            });
    });
});

// this will fail if TEST for register student is pass
describe('/POST register a duplicate student', () => {
    it('should return empty request body', function () {
        let postRequest = {
            "teacher": "teacherken5@gmail.com",
            "students":
            [
                "studentjon2111@example.com",
                "studentjon51211@example.com"
            ]
        }
        return chai.request(app)
            .post('/api/register')
            .send(postRequest)
            .then(function (res) {
                expect(res).to.have.status(409);
            });
    });
});

// this will fail if TEST for register a duplicate student is pass
describe('/POST register student', () => {
    it('should return empty request body', function () {
        let postRequest = {
            "teacher": "teacherken5@gmail.com",
            "students":
            [
                "studentjon2111@example.com",
                "studentjon51211@example.com"
            ]
        }
        return chai.request(app)
            .post('/api/register')
            .send(postRequest)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');

            });
    });
});

describe('/POST suspend student', () => {
    it('should return request body', function () {
        let postRequest = {
            "student": "studentTest123@gmail.com"
        }
        return chai.request(app)
            .post('/api/suspend')
            .send(postRequest)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
            });
    });
});


describe('/POST retrieve notification', () => {
    it('should return list of recipient', function () {
        let postRequest = {
            "teacher": "teacherken2@gmail.com",
            "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
        }
        return chai.request(app)
            .post('/api/retrievefornotifications')
            .send(postRequest)
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});




