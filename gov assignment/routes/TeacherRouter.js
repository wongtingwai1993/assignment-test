var express = require('express');
var router = express.Router();
var Teacher = require('../models/Teacher');

// router.get('/', function (req, res, next) {
//     console.log('select all here');
//     Teacher.getAllTasks(function (err, rows) {
//         if (err) {
//             res.json(err);
//         } else {
//             console.log(rows);
//             res.json(rows);
//         }
//     });
// });

// router.get('/:teacherEmail?', function (req, res, next) {
//     console.log(req.params);
//         Teacher.getTaskById(req.params.teacherEmail, function (err, rows) {
//             if (err) {
//                 res.json(err);
//             } else {
//                 res.json(rows);
//             }
//         });
// });


router.get('/commonstudents', function (req, res, next) {
    console.log(req.query);
    console.log(req.query.teacher);
    // query string was found
    if (req.query.teacher != undefined) {
        console.log('get specify student based on teacher');
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
                else{
                    res.status(204);
                    res.json(rows);
                }

            }
        });
    }
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
            console.log(err);
            res.status(500);
            res.json(err);
        } else {
            res.json(req.body); //or return count for 1 & 0  
        }
    });
});


router.post('/suspend', function (req, res, next) {
    Teacher.addSuspendStudent(req.body, function (err, count) {
        if (err) {
            console.log(err.code);
            res.status(500);
            res.json(err);
        } else {
            res.json(req.body); //or return count for 1 & 0  
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

    Teacher.getStudentRecipients(req.body.teacher, studentEmailList, function (err, count) {
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
            console.log(bodyContent);
            recipients['recipients'] = bodyContent;
            console.log(recipients);
            res.json(recipients);
        }
    });
});


module.exports = router;  