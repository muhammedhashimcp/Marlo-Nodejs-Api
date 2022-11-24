

// validation methods for user datails update form 
function updateFormValidation(fname, lname, email, DOB, phoneNumber) {
	let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let regEx = /^[A-Za-z]+$/;
	let nameError, emailError, DOBError, phoneError;
	if (fname.length < 3) {
		nameError = 'First Name should be at least 3 characters';
		return nameError;
	}
	if (!regEx.test(fname) || !regEx.test(lname)) {
		nameError = 'First Name  and Last Name should contain only alphabets';
		return nameError;
	}
	if (!pattern.test(email)) {
		emailError = 'Email is invalid';
		return emailError;
	}
	// DOB validation
	if (!(new Date(DOB) !== 'Invalid Date' && !isNaN(new Date(DOB)))) {
		DOBError = 'Date of Birth  is  invalid';
		return DOBError;
	}
	// Phone Number  validation
	if (phoneNumber.length!==10) {
		phoneError = `Phone number is not a valid 10 digit number!`;
		return phoneError;
	}

}

module.exports = updateFormValidation;
