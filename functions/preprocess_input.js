function preprocess_input(str) {
	
	var Ops = operators_database();
	var is_good = true;
	
	// Replace expressions to get proper notation of inverse trigonometric functions
	var A = [['\\sin^{-1}','\\arcsin'] , ['\\cos^{-1}','\\arccos'] , ['\\tan^{-1}','\\arctan'] , ['\\csc^{-1}','\\arccsc'] , ['\\sec^{-1}','\\arcsec'] , ['\\cot^{-1}','\\arccot']];
	A.forEach((element) => {
		str = str.replace(element[0],element[1]); 
	});
	
	// TODO: This can probably be written more compactly.
	str = str.replace('+-','-'); // Just in case user write +- in their input.
	
	str = str.replace(/(.{1})-/g,'$1+-'); // Add a '+' in front of every '-', unless the '-' is the first character. 
	
	str = str.replace(/([0-9a-zA-Z\)\}\]]{1})[" "]*([^a-zA-Z0-9])/g,'$1$2'); // Remove spaces between letters/numbers and other characters (non-letters and non-numbers).
	
	str = str.replace(/([^0-9a-zA-Z]{1})[" "]*([a-zA-Z0-9\(\{\[])/g,'$1$2'); // And the other way around.
	
	str = str.replace(/\\sqrt{/g,'\\sqrt[2]{'); // If a root is used without the power ([]), it means it's a square root.
	
	// Check if parentheses are balanced
	let par_arr = [['{','}'], ['(',')'], ['[',']'], ['|','|']];
	let par_count = new Array(par_arr.length).fill(0);
	par_arr.forEach((par,i) => { // For each parentheses type.
		for(let j=0; j<str.length; j++) {
			if(str[j] == par_arr[i][0]) { // Opening parenthesis.
				par_count[i]++;
			} else if(str[j] == par_arr[i][0]) { // Closing parenthesis.
				par_count[i]--;
			}
		}
		
		if( (i < 3 && par_count[i] != 0) || (i == 3 && par_count % 2 != 0) ) { // If a parentheses type is not balanced, or if the number of | is not even.
			return [str,false];
		}
	});
	
	// Absolute value (||) look ahead
	let abs_pos = [];
	let N = par_count[3]; // Total number of |.
	// let L = str.length;
	for(let i=0; i<str.length; i++) {
		if(str[i] == '|') {
			abs_pos.unshift(i); // Save the position of the i-th | (push each element to first position).
		}
	}
	
	abs_pos.forEach((s,i) => { // Goes over | in reverse order.
		if(i == 0) { // Last |.
			str = str.slice(0,abs_pos[i]) + '\\absc ' + str.slice(abs_pos[i]+1); // Last | must be closing type.
		} else if(i == abs_pos.length - 1) { // First |.
			str = str.slice(0,abs_pos[i]) + '\\abso ' + str.slice(abs_pos[i]+1); // First | must be opening type.
		} else if(str.slice(abs_pos[i]+1).match(/^([ ]*[a-z]+)/g)) { // If it is followed by a letter/number, it is opening type.
			str = str.slice(0,abs_pos[i]) + '\\abso ' + str.slice(abs_pos[i]+1); // First | must be opening type.
		} else {
			str = str.slice(0,abs_pos[i]) + '\\absc ' + str.slice(abs_pos[i]+1); // Last | must be closing type.
		}
	});
	
	/*
	if(abs_pos.length % 2 == 0) { // If there is an even number of |.
		for(let i=0; i<((abs_pos.length+1)/2)) { // Go over them from outside inside.
			// if there is an operator before | (including itself, but not including parentheses), then it must be opening. If after, it must be closing.
			// '|x| y |x|', '|x |y| x|'
			// '| |x| - 1 |'
		}
	} else {
		return [str,false];
	}
	*/
	
	return [str,is_good];
}