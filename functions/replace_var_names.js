function replace_var_names(S) {
	
	// This function gets a sorted tree and replaces all letters (variables/parameters) using a predefined list of letters,
		// according to their order in the tree (higher levels first, then by id).
	// The function assumes that all leafs are single character.
	// If a param/var appears multiple times, its best occurance (according to the sorting rule) is used for sorting.
	
	var range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i);
	var Letters_Vector = String.fromCharCode(...range(97,122).concat(range(65,90))); // a-z,A-Z.
	
	var F1 = find(isnan([S.type])); // Find all leafs.
	
	// Create an array of parameter/var elements:
	var params = {}; // An array of params/vars elements, with keys as their string (.e.g., letter).
	for(let i=0; i<S.id.length) {
		if(S.operator[i] == -1) { // If it's a parameter/var element.
			
			if(S.str[i] in params) { // If this element has already been added before.
				if(S.level[i] <= params.(S.str[i])[0] && S.parent_id[i] < params.(S.str[i])[1] && S.id[i] < params.(S.str[i])[2]) { // If the current element is better according to the sorting rule, use it instead.
					params.(S.str[i]) = [S.level[i], S.parent_id[i], S.id[i]];
				} // else do nothing.
			} else { // Add it.
				params.(S.str[i]) = [S.level[i], S.parent_id[i], S.id[i]];
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
	var I = Object.keys(params); // Get the numeric indices of the sorted object.
	for(let i=0; i<S.id.length) {
		S.str[i] = String.fromCharCode(Letters_Vector[I.indexOf(params.(S.str[i]))]);
	}
	
	return S;
}