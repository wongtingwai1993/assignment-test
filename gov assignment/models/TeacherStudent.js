var db = require('../dbconnection'); //reference of dbconnection.js  
var TeacherStudent = {
    
    getStudents: function (teacher, callback) {
        console.log('the value =' + teacher);
        console.log('the length =' + teacher.length);
        if (teacher instanceof Array) {
            return db.query("select student_email from school_teacher_student where teacher_email in (?) group by student_email having count(student_email) = ?", [teacher,teacher.length], callback);
        }
        else {
            return db.query("select student_email from school_teacher_student where teacher_email in (?)", [teacher], callback);
        }
    },
    addSuspendStudent: function (student, callback) {
        return db.query("UPDATE school_teacher_student SET suspend_flag = true WHERE  student_email = ? ", [student.student], callback);
    },
    getStudentRecipients: function (teacher, callback) {
        console.log(teacher);
        // var result = db.query("select ts.studentEmail from school_teacher_student ts, school_suspend_student st where ts.studentEmail != st.studentEmail and ts.teacherEmail = ? and ts.studentEmail in (?) ", [teacher, studentList], callback);
        // console.log(result);

        return db.query("select student_email from school_teacher_student where suspend_flag = false and teacher_email = ? ", [teacher], callback);
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
        return db.query("INSERT INTO school_teacher_student (teacher_email,student_email) VALUES ?", [totalRecord], callback);
    }
};
module.exports = TeacherStudent;  