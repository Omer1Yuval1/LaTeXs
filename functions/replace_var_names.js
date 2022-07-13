function replace_var_names(S) {
	
	// This function gets a sorted tree and replaces all letters (variables/parameters) using a predefined list of letters,
		// according to their order in the tree (higher levels first, then by id).
	// The function assumes that all leafs are single character.
	// If a param/var appears multiple times, its best occurance (according to the sorting rule) is used for sorting.
	
	var range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i);
	var Letters_Vector = String.fromCharCode(...range(97,122).concat(range(65,90))); // a-z,A-Z.
	
	// Create an array of parameter/var elements:
	var params = []; // An array of params/vars elements, with keys as their string (.e.g., letter).
	var letters = [];
	for(let i=0; i<S.length; i++) {
		if([-1,-2].includes(S[i].operator)) { // If it's a parameter/var element.
			if(letters.includes(S[i].str)) { // If this element has already been added before.
				let ii = letters.indexOf(S[i].str); // The index of the previous occurance in the params/letters arrays.
				params[ii][4].push(i); // Add the index of the new element with the same letter.
				
				// If the current element is better according to the sorting rule, use it instead.
				if(S[i].level > params[ii][0] || (S[i].level == params[ii][0] && S[i].parent_id < params[ii][1]) || (S[i].level == params[ii][0] && S[i].parent_id == params[ii][1] && S[i].id < params[ii][2])) {
					params[ii][0] = S[i].level;
					params[ii][1] = S[i].parent_id;
					params[ii][2] = S[i].id;
				}
			} else { // Just add it.
				params.push([S[i].level, S[i].parent_id, S[i].id, S[i].str, [i]]);
				letters.push(S[i].str);
			}
		}
	}
	
	// Sort the array of leaf elements:
	params.sort(function(a,b) { // Smallest comes first.
		if(a[0] != b[0]) { // Sort by level.
			return a[0] - b[0];
		} else if(a[1] != b[1]) { // Sort by parent_id.
			return a[1] - b[1];
		} else { // Sort by id.
			return a[2] - b[2];
		}
	});
	
	// Use the order of keys in params to update the the string of each param/var element:
	for(let i=0; i<params.length; i++) { // For each letter.
		for(let j=0; j<params[i][4].length; j++) { // For each element with this letter.
			S[params[i][4][j]].str = Letters_Vector[i];
		}
	}
	
	return S;
}