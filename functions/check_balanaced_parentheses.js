function check_balanaced_parentheses(str) {
	
	let par_arr = [['{','}'], ['(',')'], ['[',']'], ['|','|']];
	let par_count = new Array(par_arr.length).fill(0);
	for(let i=0; i<par_arr.length; i++) {
		for(let j=0; j<str.length; j++) {
			if(str[j] == par_arr[i][0]) { // Opening parenthesis.
				par_count[i]++;
			} else if(str[j] == par_arr[i][1]) { // Closing parenthesis.
				par_count[i]--;
			}
		}
		
		if( (i < 3 && par_count[i] != 0) || (i == 3 && par_count[i] % 2 != 0) ) { // If a parentheses type is not balanced, or if the number of | is not even.
			return [false,NaN];
		}
	}
	
	return [true, par_count[3]]; // Return if balanced and the number of |.
}