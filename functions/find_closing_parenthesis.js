function find_closing_parenthesis(str,i0) {
	
	// This functions checks if all parentheses in a string are balanced.
	
	let par_arr = {'{': '}', '(': ')', '[': ']'};
	closing_par = par_arr[str[i0]];
	
	let par_count = 1;
	for(let i=0; i<str.length; i++) {
		if(str[i] == str[i0]) { // Same opening parenthesis.
			par_count[i]++;
		} else if(str[i] == par_arr[str[i0]]) { // The matching closing parenthesis.
			par_count[i]--;
		}
		if(par_count == 0) { // If the tested parenthesis is now balanced.
			return i; // Return the index of the closing parenthesis.
		}
	}
	
	return -1; // Return -1 if the parenthesis is never balanced.
}