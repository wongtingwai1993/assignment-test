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


router.get('/', function (req, res, next) {
    console.log('over here');
    console.log(req.query);
    console.log(req.query.teacher);
    if (res.query) {
        Teacher.getStudents(req.query.teacher, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    }
    else {
        Teacher.getAllTasks(function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                console.log(rows);
                res.json(rows);
            }
        });
    }

});

router.post('/', function (req, res, next) {
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
    // Teacher.getStudentRecipients(req.body, function (err, count) {
    //     if (err) {
    //         console.log(err);
    //         res.status(500);
    //         res.json(err);
    //     } else {
    //         res.json(req.body); //or return count for 1 & 0  
    //     }
    // });
});



module.exports = router;  