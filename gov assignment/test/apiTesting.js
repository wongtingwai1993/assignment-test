'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../app.js'); // Our app
const emailValidator = require('email-validator')

describe('test valid email', ()=>{
    it("should validate email", function(){
        expect(emailValidator.validate('test@gmail.com')).equal(true); 
    })
} )

describe('test invalid email', ()=>{
    it("should validate email", function(){
        expect(emailValidator.validate('tasdasdsad')).equal(false); 
    })
} )

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
                expect(res.body).to.be.an('object');
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

describe('/POST suspend a duplicate student', () => {
    it('should return empty body', function () {
        let postRequest = {
            "student": "studentTest123@gmail.com"
        }
        return chai.request(app)
            .post('/api/suspend')
            .send(postRequest)
            .then(function (res) {
                expect(res.body).to.be.an('object');
                expect(res).to.have.status(409);
            });
    });
});

// this will fail if TEST for suspect duplicate student is pass
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




