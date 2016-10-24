var student = require('./student');
var teacher = require('./teacher');

function setUpClassRoom (teacherName, students) {
	 teacher.addTeacher(teacherName);

	 students.forEach( function(element, index) {
	 	student.addStudent(element);
	 });
}

exports.setUpClassRoom = setUpClassRoom;