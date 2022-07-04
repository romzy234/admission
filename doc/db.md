Tree 
Staff Table || DONE
Applicant Table || DONE
Admission Table || DONE
Department Table || DONE

admission table 
	name | String
	applicant_id | Foreign - From applicant
	matricNo | required | unique
	Department | required | 
	grade cummlative score | Number | required
	ID | Unique | Auto-Generate
	date | timestamp

Staff Table  
	username | String | unique
	password | String | minlength 6 | unique
	email | unique | String

Applicant Table 
	name | String | required,
    DateOfBirth | required
	email | unique | String
	department |Foreign - From Department
	jamb score | Number | require | max "400"
	result [] | Array | require
	state of Origin |String
	gender | String | require
	status | String | DEFAULT = 'Pending'
	
Department
	name | String | required,
	max_Number | Number | require #Number of student needed
	jamb_score | Number | require 
	wace[] | Array | required,
	hod | string
	detail | String