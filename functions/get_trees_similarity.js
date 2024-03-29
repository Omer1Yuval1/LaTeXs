function get_trees_similarity(S0,S1,vars,params,param_constraints) {
	
	// This function computes a similarity score between two given trees.
	// The similarity is computed asymmetrically, as one tree (S0) is the reference tree, and the second (S1) is the tested tree.
	// The trees are assumed to be sorted.
	// `params` is an object of matching child nodes where each key is a variable/parameter, and the value is an array.
		// where the first element is the value, and the other two elements are the indices of the elements.
	
	// Run examples
	/*
		[S0, text0] = index(34,0);
		[S1, text1] = index(35,0);
		[C0,C1] = get_trees_similarity(S0,S1);
		
		[C0,C1] = get_trees_similarity('a*x^2','3*x^2');
		
		[C0,C1] = get_trees_similarity('x^2+bx+c','y^2+5y+6',{'x'},{'b','c'});
		[C0,C1] = get_trees_similarity('x^2+bx+b','x^2+5x+6',{'b'}); // Different values for the same parameter.
	*/
	
	if(typeof(S0) == 'string' && typeof(S1) == 'string') {
		var [S0, text0] = index(S0,1,"#LaTex_AST_0"); // mode=1 means the tree will be sorted.
		var [S1, text1] = index(S1,1,"#LaTex_AST_1"); // ".
	} else { // Assume both are sorted.
		// var [S0, text0] = index(S0[0].str,1,0); // mode=1 means the tree will be sorted.
		// var [S1, text1] = index(S1[0].str,1,0); // ".
	}
	
	// Create nested arrays for the reference (S0) and input (S1) trees
	var [C0,C0i] = generate_nested_array(S0,[],[],null);
	var [C1,C1i] = generate_nested_array(S1,[],[],null);
	
	// Compare the nested arrays of the reference (C0) and input (C1) trees
	var [op_score,leaf_score] = compare_nested_arrays(C0,C1,0,0);
	console.log("\nOperator nodes similarity = " + op_score, "\nLeaf nodes similarity = " + leaf_score);
	
	// Match values
	var params;
	if(op_score == 0) { // If parameters are given as an input argument && if the structures are identical.
		// var vars_vals = new Array(vars.length).fill(null);
		// var param_vals = new Array(params.length).fill(null);
		params = match_values(C0,C1,C0i,C1i,{});
		
		
		var color_map = ["#C0392B", "#9B59B6" ,"#3498DB", "#1ABC9C", "#F39C12", "#A04000", "#707B7C"];
		var keys = Object.keys(params);
		for(let k=0; k<keys.length; k++) {
			for(let i=0; i<S0.length; i++) {
				if(S0[i].str == keys[k] && !(params[keys[k]][0] == null) && params[keys[k]][1].includes(S0[i].id)) {
					document.getElementById("node_" + S0[i].id + "_0").style.color = color_map[k];
					
					for(let j=0; j<params[keys[k]][2].length; j++) {
						document.getElementById("node_" + params[keys[k]][2][j] + "_1").style.color = color_map[k];
					}
				}
			}
		}
	}
	
	console.log("params: ", params);
	
	return [params, C0, C1];
}

function generate_nested_array(S,C,Ci,p) {
	
	for(let i=0; i<S.length; i++) { // For each child element of parent p (with indices in ascending order (according to tree sorting)).
		if(S[i].parent_id == p) { // If this element is a child of element p.
			
			// This is just to check if element i has child nodes
			var has_child = false;
			for(let j=0; j<S.length; j++) { // Check if the current element has children.
				if(S[j].parent_id == S[i].id) { // If the i-th element has at least one child, set has_child to true and break the loop.
					has_child = true;
					break;
				}
			}
			
			if(!has_child) { // If it's a leaf.
				C.push(S[i].sign + S[i].str); // Add the i-th child's str (param/number).
				Ci.push(S[i].id); // Also save its id.
			} else { // If the element has 1+ children.
				if([-1,-2].includes(S[i].operator)) { // If it is a variable/parameter (e.g., x) or an arbitrary function (e.g., f(x)), add their symbol rather than their operator.
					C.push([S[i].sign + S[i].str]); // Add their symbol.
				} else {
					C.push([S[i].operator]); // Add the i-th child operator as an array.
				}
				Ci.push([S[i].id]); // Also save its id (also as an array).
				[C[C.length - 1],Ci[Ci.length - 1]] = generate_nested_array(S,C[C.length - 1],Ci[Ci.length - 1],S[i].id); // Repeat the process recursively for the i-th element's subtree.
			}
		}
	}
	
	return [C,Ci];
}

function compare_nested_arrays(C0,C1,op_score,leaf_score) {
	for(let i=0; i<C0.length; i++) { // For each pair of corresponding arrays of C0 and C1 in the current level (the first element in each level is the parent).
		if(!Array.isArray(C0[i]) && !Array.isArray(C1[i])) { // If both arrays have a single element in the i-th cell (and can thus be compared).
			if(typeof(C0[i]) == 'number' && typeof(C1[i]) == 'number' && ![-1,-2].includes(C0[i])) { // If both are numerical (i.e., not leafs, which are saved as strings of letters or numbers).
				if(C0[i] != C1[i]) {
					op_score = op_score + 1;
				}
			} else if(typeof(C0[i]) == 'string' && typeof(C1[i]) == 'string' || [-1,-2].includes(C0[i])) { // If both are leafs, or arbitrary functions.
				if(C0[i] != C1[i]) {
					leaf_score = leaf_score + 1;
				}
			} else { // One is a leaf and one is not.
				op_score = op_score + 1;
				leaf_score = leaf_score + 1;
			}
		} else if(Array.isArray(C0[i]) && Array.isArray(C1[i])) { // If both arrays have multiple elements in the i-th cell.
			[op_score,leaf_score] = compare_nested_arrays(C0[i],C1[i],op_score,leaf_score);
		} else {// If one array has a single element and the other multiple elements in the i-th cell.
			// Compare only the first element.
		}
	}
	
	return [op_score,leaf_score];
}

function match_values(C0,C1,C0i,C1i,params) {
	
	for(let i=0; i<C0.length; i++) { // For each pair of corresponding cells of C0 and C1 in the current level (the first element in each level is the parent).
		if(typeof(C0[i]) == 'string' && typeof(C1[i]) == 'string' && isNaN(C0[i])) { // If both are leafs && the reference element is not a number (i.e., a variable or parameter).
			
			if(C0[i] in params && C1[i] != params[C0[i]][0]) { // If a value for this parameter already exists && this value is different from the current value.
				params[C0[i]] = [null]; // Set the value to NaN.
			} else if(C0[i].replace('-','') in params) { // If the parameter already exists in params (remove minus sign to compare) and its value matches the previous value.
				params[C0[i]] = [ C1[i], [...params[C0[i]][1], C0i[i]], [...params[C0[i]][2], C1i[i]] ]; // Just add the id of this element to the [1] array.
			} else { // If the parameter does not yet exist in params, add it: params[key] = [value, [id]];
				if(C0[i][0] == '-' && C1[i][0] == '-') { // If both have a minus sign.
					params[C0[i].slice(1)] = [ C1[i].slice(1), [C0i[i]], [C1i[i]] ]; // Remove the minus sign from both (-b = -5 => b = 5).
				} else if(C0[i][0] == '-' && C1[i][0] != '-') { // The parameter has a minus sign, but the number does not.
					params[C0[i].slice(1)] = [ "-" + C1[i], [C0i[i]], [C1i[i]] ]; // Transfer the minus sign from the parameter to the number (-b = 5 => b = -5).
				} else { // If the number has a minus sign, but the parameter does not, OR if both don't have it.
					params[C0[i]] = [ C1[i], [C0i[i]], [C1i[i]] ];
				}
			}
		} else if(Array.isArray(C0[i])) {
			params = match_values(C0[i],C1[i],C0i[i],C1i[i],params);
		} // else - continue. Do nothing about non-leaf elements.
	}
	
	return params;
}