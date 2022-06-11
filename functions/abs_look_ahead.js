function abs_look_ahead(str,abs_count) {
	
	let abs_pos = [];
	let N = abs_count[3]; // Total number of |.
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
	
	return str;
}