var db = require('../dbconnection'); //reference of dbconnection.js  
var Teacher = {
    getAllStudents: function (callback) {
        return  db.query("Select * from school_student", callback);
    },
    getStudents: function (teacher, callback) {
        console.log('the value =' + teacher);
        return db.query("select studentEmail from school_teacher_student where teacherEmail in (?)", [teacher], callback);
    },
    addSuspendStudent: function (student, callback) {
        return db.query("INSERT INTO school_suspend_student (studentEmail) VALUES (?) ", [student.student], callback);
    },
    getStudentRecipients: function (teacher, callback) {
        console.log('inside model');
        console.log(teacher);
        console.log('hasdjhasjkdhasd here');
        // var result = db.query("select ts.studentEmail from school_teacher_student ts, school_suspend_student st where ts.studentEmail != st.studentEmail and ts.teacherEmail = ? and ts.studentEmail in (?) ", [teacher, studentList], callback);
        // console.log(result);

        return db.query("select ts.studentEmail from school_teacher_student ts, school_suspend_student st where ts.studentEmail != st.studentEmail and ts.teacherEmail = ? ", [teacher], callback);
    },
    registerStudent: function (Teacher, callback) {
        //console.log(Teacher);
        // need to create an array
        var totalRecord = [];

        for (var i = 0; i < Teacher.students.length; i++) {
            var objectValue = [];
            objectValue.push(Teacher.teacher);
            objectValue.push(Teacher.students[i]);
            totalRecord.push(objectValue);
        }
        console.log(totalRecord);
        return db.query("INSERT INTO school_teacher_student (teacherEmail,studentEmail) VALUES ?", [totalRecord], callback);
    }
};
module.exports = Teacher;  