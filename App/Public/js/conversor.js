exports.changeDateFormat = function(inputDate){ 

	var splitDate = inputDate.split(".");
	var month = splitDate[0];
	var day = splitDate[1];
	var year = splitDate[2]; 
	var splitDate2 = year.split(" ");
	var year = splitDate2[0];
	var resto = splitDate2[1];

	return month + '.' + day + '.' + year + ' ' + resto;

}

exports.changeDateInserted = function(inputDate,num){


	var year = inputDate.getFullYear();
	//var month = inputDate.getMonth() + 1;
	//var day = inputDate.getDate(); 
	var month = ("0" + (inputDate.getMonth() + 1)).slice(-2);
	var day = ("0" + inputDate.getDate()).slice(-2);

	if (num == 1){
		var hour = inputDate.getHours();
	} else {
		var hour = inputDate.getHours() + 1;
		if (hour == 24 ){ hour = '00'}	
	}
	var minutes = ('0'+ inputDate.getMinutes()).slice(-2);

//07/14/2017 00:05

	console.log(inputDate);
	return month + '/' + day + '/' + year + ' ' + hour + ':' + minutes;
}

exports.changeDate1hoursmore = function(inputDate){

	var splitDate = inputDate.split(":");
	var hour = parseInt(splitDate[0]) + 1;
	var minute = splitDate[1];

	return hour + ':' + minute;
}



