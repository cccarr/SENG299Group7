angular.module('mainCtrl', [])
.controller('mainController', function(){

	var vm = this;

	// basic variable to display
	vm.message ="SENG 299 Angular Tutorial"

	// a list of students that will be displayed on the home page
	vm.students = [
		{first: "David", last: "Johnson"},
		{first: "Ernest", last: "Aaron"}
	];
	// information that comes from our form
	vm.studentData = {};

	//function to add student to list
	vm.addStudent = function() {
	    
	    // add a computer to the list
	    vm.students.push({
		first: vm.studentData.first,
		last: vm.studentData.last,
	    });

	    // after our computer has been added, clear the form
	    vm.studentData = {};
	};
});
