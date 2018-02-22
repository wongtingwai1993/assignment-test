var express = require('express');
var router = express.Router();
var Teacher = require('../models/Teacher');
var emailValidator = require('email-validator');
var logger = require("../logger");

router.get('/commonstudents', function (req, res, next) {
    logger.info("/common students is called...")
    logger.info("accepted query = " + JSON.stringify(req.query));
    // query string was found
    if (req.query.teacher != undefined) {
        Teacher.getStudents(req.query.teacher, function (err, rows) {
            if (err) {
                logger.error('error occur!' + err);
                res.json(err);
            } else {
                if (rows.length > 0) {
                    var students = {};
                    var bodyContent = [];
                    for (var x = 0; x < rows.length; x++) {
                        bodyContent.push(rows[x].studentEmail);
                    }
                    logger.info('Response set=' + bodyContent);
                    students['students'] = bodyContent;
                    res.status(200).json(students);
                }
                else {
                    logger.info("no student found...")
                    res.status(204);
                    res.json(rows);
                }

            }
        });
    }
    // just an extra feature
    else {
        Teacher.getAllStudents(function (err, rows) {
            if (err) {
                logger.info("error occur" + err);
                res.json(err);
            } else {
                logger.info("/get all students is called...")
                logger.info('Response set=' + rows);
                res.json(rows);
            }
        });
    }

});

router.post('/register', function (req, res, next) {
    logger.info("/register is called...");
    logger.info("request body="+ JSON.stringify(req.body));
    Teacher.registerStudent(req.body, function (err, count) {
        // validate for the email
        for (var x = 0; x < req.body.students.length; x++) {
            if (!emailValidator.validate(req.body.students[x])) {
                logger.error("Invalid email is found!" + req.body.students[x]);
                res.status(422);
                res.json(req.body.students[x]);
                return;
            }
        }

        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                logger.error("Duplicate of entry!" + err);
                res.status(409);
            } else {
                logger.error("Unknown error!" + err);
                res.status(500);
            }
            res.json({});
        } else {
            logger.info('Response set=' + req.body);
            res.json(req.body);
        }
    });
});


router.post('/suspend', function (req, res, next) {
    logger.info('request body='+ JSON.stringify(req.body));
    Teacher.addSuspendStudent(req.body, function (err, count) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                logger.error("Duplicate of entry!" + err);
                res.status(409);
            } else {
                logger.error("Unknown error!" + err);
                res.status(500);
            }
            res.json({});
        } else {
            logger.info('Response set=' + req.body);
            res.json(req.body);
        }
    });
});
router.post('/retrievefornotifications', function (req, res, next) {
    logger.info('request body='+ JSON.stringify(req.body));
    var startWithMention = false;
    var endWithMentionCheck = false;
    var endWithMention = '';
    var studentEmail = '';
    var studentEmailList = [];

    // loop through string as char array to look for @
    for (var x = 0; x < req.body.notification.length; x++) {
        if (startWithMention) {
            studentEmail += req.body.notification.charAt(x);
            // first regex is @gmail and should end with .com
            var numberOfAt = studentEmail.match(/\@/g);

            if (numberOfAt && numberOfAt.length > 1) {
                logger.error('Invalid email address=' + studentEmail);
                res.status(422);
                res.json({});
                return;
            }
            else if (studentEmail.length >= 50) {
                logger.error('Invalid email length (50)=' + studentEmail);
                res.status(422);
                res.json({});
                return;
            }
            else if (studentEmail.match('[@]{1,}[a-zA-Z]') && studentEmail.endsWith('.com')) {
                studentEmailList.push(studentEmail);
                startWithMention = false;
                studentEmail = '';
                logger.info('updated studentEmailList = ' + studentEmailList);
            }
        }
        if (!startWithMention && req.body.notification.charAt(x) === "@") {
            startWithMention = true;
        }
    }

    Teacher.getStudentRecipients(req.body.teacher, function (err, count) {
        if (err) {
            logger.error(err);
            res.status(500);
            res.json(err);
        } else {
            var recipients = {};
            var bodyContent = [];
            for (var x = 0; x < count.length; x++) {
                bodyContent.push(count[x].studentEmail);
            }
            for (var u = 0; u < studentEmailList.length; u++) {
                bodyContent.push(studentEmailList[u]);
            }
            recipients['recipients'] = bodyContent;
            logger.info('Response set=' + recipients);
            res.json(recipients);
        }
    });
});


module.exports = router;  