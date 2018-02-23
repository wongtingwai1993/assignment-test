var express = require('express');
var router = express.Router();
var teacherStudent = require('../models/TeacherStudent');
var emailUtil = require('../utils/EmailValidator');
var logger = require("../logger");

// refactor to different classes when DB calls increase
router.get('/commonstudents', function (req, res, next) {
    logger.info("/common students is called...")
    console.log(req.query);
    logger.info("accepted query = " + JSON.stringify(req.query));
    // query string was found
    if (req.query.teacher != undefined) {
        teacherStudent.getStudents(req.query.teacher, function (err, rows) {
            if (err) {
                logger.error('error occur!' + err);
                res.json(err);
            } else {
                if (rows.length > 0) {
                    logger.info(rows);
                    var students = {};
                    var bodyContent = [];
                    for (var x = 0; x < rows.length; x++) {
                        bodyContent.push(rows[x].student_email);
                    }
                    logger.info('Response set=' + JSON.stringify(bodyContent));
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
    else {
        res.status(404);
        res.json({});
    }
});

router.post('/register', function (req, res, next) {
    logger.info("/register is called...");
    logger.info("request body=" + JSON.stringify(req.body));
    teacherStudent.registerStudent(req.body, function (err, count) {
        // validate for the email
        if (!emailUtil.validateEmail(req.body.teacher)) {
            logger.error("Invalid email is found!" + req.body.teacher);
            res.status(422);
            res.json(req.body.teacher);
            return;
        }

        for (var x = 0; x < req.body.students.length; x++) {
            if (!emailUtil.validateEmail(req.body.students[x])) {
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
            logger.info('Response set=' + JSON.stringify(req.body));
            res.json(req.body);
        }
    });
});


router.post('/suspend', function (req, res, next) {
    logger.info('request body=' + JSON.stringify(req.body));
    if (!emailUtil.validateEmail(req.body.student)) {
        res.status(422);
        res.json({});
        return;
    }
    teacherStudent.addSuspendStudent(req.body, function (err, count) {
        if (err) {

            logger.error("Unknown error!" + err);
            res.status(500);

            res.json({});
        } else {
            logger.info('Response set=' + JSON.stringify(req.body));
            res.json(req.body);
        }
    });
});
router.post('/retrievefornotifications', function (req, res, next) {
    logger.info('request body=' + JSON.stringify(req.body));
    var startWithMention = false;
    var endWithMentionCheck = false;
    var endWithMention = '';
    var studentEmail = '';
    var studentEmailList = [];

    // loop through string as char array to look for @
    var spaceDelimiter = req.body.notification.split(" ");
    console.log(spaceDelimiter);
    logger.info(spaceDelimiter);
    for (var x = 0; x < spaceDelimiter.length; x++) {
        if (spaceDelimiter[x].charAt(0) === "@") {
            var removeFirstAt = spaceDelimiter[x].substring(1, spaceDelimiter[x].length);
            if (emailUtil.validateEmail(removeFirstAt)) {
                studentEmailList.push(removeFirstAt);
                logger.info('updated studentEmailList = ' + studentEmailList);
            }
            else {
                logger.error('Invalid email address=' + studentEmail);
                res.status(422);
                res.json({});
                return;
            }
        }
    }
    var validatedStudent = [];
    teacherStudent.getStudent(studentEmailList, function (err, count) {
        console.log(count);
        validatedStudent = count;
    });
    logger.info(); console.log('after validate');
    console.log(validatedStudent);
    teacherStudent.getStudentRecipients(req.body.teacher, function (err, count) {
        if (err) {
            logger.error(err);
            res.status(500);
            res.json(err);
        } else {
            var recipients = {};
            var bodyContent = [];
            for (var x = 0; x < count.length; x++) {
                bodyContent.push(count[x].student_email);
            }

            if (validatedStudent != []) {
                for (var u = 0; u < validatedStudent.length; u++) {
                    console.log('inside of validatedStudent');
                    console.log(validatedStudent[u]);
                    if (bodyContent.indexOf(validatedStudent[u].student_email) < 0) {
                        bodyContent.push(validatedStudent[u].student_email);
                    }
                }
            }

            recipients['recipients'] = bodyContent;
            logger.info('Response set=' + JSON.stringify(recipients));
            res.json(recipients);
        }
    });
});


module.exports = router;  