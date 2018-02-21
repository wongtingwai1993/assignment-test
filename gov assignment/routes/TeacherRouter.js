var express = require('express');
var router = express.Router();
var Teacher = require('../models/Teacher');

router.get('/commonstudents', function (req, res, next) {
    console.log(req.query);
    console.log(req.query.teacher);
    // query string was found
    if (req.query.teacher != undefined) {
        Teacher.getStudents(req.query.teacher, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                if (rows.length > 0) {
                    var students = {};
                    var bodyContent = [];
                    for (var x = 0; x < rows.length; x++) {
                        bodyContent.push(rows[x].studentEmail);
                    }
                    students['students'] = bodyContent;
                    res.status(200).json(students);
                }
                else {
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
                res.json(err);
            } else {
                console.log('get all students');
                console.log(rows);
                res.json(rows);
            }
        });
    }

});

router.post('/register', function (req, res, next) {
    Teacher.registerStudent(req.body, function (err, count) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.status(409);
            } else {
                res.status(500);
            }
            res.json({});
        } else {
            res.json(req.body);
        }
    });
});


router.post('/suspend', function (req, res, next) {
    Teacher.addSuspendStudent(req.body, function (err, count) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.status(409);
            } else {
                res.status(500);
            }
            res.json({});
        } else {
            res.json(req.body);
        }
    });
});
router.post('/retrievefornotifications', function (req, res, next) {
    console.log(req.body);
    var startWithMention = false;
    var endWithMentionCheck = false;
    var endWithMention = '';
    var studentEmail = '';
    var studentEmailList = [];

    for (var x = 0; x < req.body.notification.length; x++) {
        if (startWithMention) {
            studentEmail += req.body.notification.charAt(x);
            // first regex is @gmail and should end with .com
            if (studentEmail.match('[@]{2,}')) {
                console.log('invalid email address');
                return;
            }
            else if (studentEmail.length >= 50) {
                console.log('error occur');
                return;
            }
            else if (studentEmail.match('[@]{1,}[a-zA-Z]') && studentEmail.endsWith('.com')) {
                studentEmailList.push(studentEmail);
                startWithMention = false;
                studentEmail = '';
                console.log(studentEmailList);
            }
        }
        if (!startWithMention && req.body.notification.charAt(x) === "@") {
            startWithMention = true;
        }
    }

    Teacher.getStudentRecipients(req.body.teacher, function (err, count) {
        if (err) {
            console.log(err);
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
            console.log(bodyContent);
            recipients['recipients'] = bodyContent;
            console.log(recipients);
            res.json(recipients);
        }
    });
});


module.exports = router;  