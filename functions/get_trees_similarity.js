function get_trees_similarity(S0,S1,vars,params,param_constraints) {
	
	// This function computes a similarity score between two given trees.
	// The similarity is computed asymmetrically, as one tree (S0) is the reference tree, and the second (S1) is the tested tree.
	// The trees are assumed to be sorted.
	
	// Run examples
	/*
		S0 = index(34,0);
		S1 = index(35,0);
		[C0,C1] = get_trees_similarity(S0,S1);
		
		[C0,C1] = get_trees_similarity('a*x^2','3*x^2');
		
		[C0,C1] = get_trees_similarity('x^2+bx+c','y^2+5y+6',{'x'},{'b','c'});
		[C0,C1] = get_trees_similarity('x^2+bx+b','x^2+5x+6',{'b'}); // Different values for the same parameter.
	*/
	
	// Thoughts:
		// I'm pretty sure that the nested structure can be linealized.
			// Assign every set of direct children indices from 1 to n (after sorting).
			// Then create an array with 3 columns: id,parent_id,level.
			// Then sort this array using all columns. Then compare arrays.
		// The nested structure might make it easier to apply shifts when comparing. How would this be done in the linealized representation?
	// TODO
		// Try to perform the comparison using the same recursive function.
			// Try to also find the param-number matching at the same time.
		// A newer idea
			// Use a cell array with nested array.
				// This way I will not have to create empty cells (as opposed to matrix that has to be rectangular).
			// Two comparison modes
				// Similarity.
				// Matching of a specific problem to a generalized problem.
					// Only match nodes and numbers in the target.
					// Find the matching between source numbers and target parameters.
					// Test case: ax^2 + bx + c.
		// A new idea:
			// Each level is a dimension.
			// Create a multi-D array where each level has its own dimention.
			// This way, the number of children (including non-direct children) elements does not affect the relative position of parent elements at the same level.
			// Then, these matrices can be compared by dot product (for structure comaprison only), or by == to also check if operators at the same position are identical.
		// Rewrite this algorithm. The ids and parent ids are different in different trees (even if trees are identical).
			// Simply go down the hierarchy and compare elements. This will also enable to match sub-trees.
			// This can be done recursively, very similar to the sorting algorithm (only that here we already have the order).
			// Alternatively, I could go over each level, and assign new temporary ids in the same order of the original ids.
				// Checked this. ids across elements in a certain level are also not sorted. The sorting in the plot is obtained by their parents.
				// So really the only way is probably to go both horizontally (right) and down the hierarchy.
				// I could map each tree's hierarchy and assign sub-ids, and then build the mat0 and mat1.
		// If an element is not found, I consider its distance NaN. But actually it should probably be the largest penalty.
		// Normalise each level by divding by the number of elements (more elements means more chances for match).
			// Think of normalising for the total number of ref elements for comparing scores across ref formulas.
				// But I think that dividing by the number of element in each level already accounts for this.
	
	if(typeof(S0) == 'string' && typeof(S1) == 'string') {
		var S0 = index(S0,1,"#LaTex_AST_0"); // mode=1 means the tree will be sorted.
		var S1 = index(S1,1,"#LaTex_AST_1"); // ".
	} else { // Assume both are sorted.
		// var S0 = index(S0[0].str,1,0); // mode=1 means the tree will be sorted.
		// var S1 = index(S1[0].str,1,0); // ".
	}
	
	// Create nested arrays for the reference (S0) and input (S1) trees
	var [C0,C0i] = generate_nested_array(S0,[],[],null);
	var [C1,C1i] = generate_nested_array(S1,[],[],null);
	C0 = C0[0];
	C1 = C1[0];
	C0i = C0i[0];
	C1i = C1i[0];
	
	// console.log(C0);
	// console.log(C1);
	
	// Compare the nested arrays of the reference (C0) and input (C1) trees
	var [op_score,leaf_score] = compare_nested_arrays(C0,C1,0,0);
	console.log("\nOperator nodes similarity = " + op_score, "\nLeaf nodes similarity = " + leaf_score);
	
	// Match values
	if(op_score == 0) { // If parameters are given as an input argument && if the structures are identical.
		// var vars_vals = new Array(vars.length).fill(null);
		// var param_vals = new Array(params.length).fill(null);
		var params = match_values(C0,C1,C1i,{});
		console.log(params);
		
		var color_map = ["#C0392B", "#9B59B6" ,"#3498DB", "#1ABC9C", "#F39C12"];
		var keys = Object.keys(params);
		for(let k=0; k<keys.length; k++) {
			for(let i=0; i<S0.length; i++) {
				if(S0[i].str == keys[k] && !(params[keys[k]][0] == null)) {
					document.getElementById("node_" + i + "_0").style.color = color_map[k];
					
					for(let j=0; j<params[keys[k]][1].length; j++) {
						document.getElementById("node_" + params[keys[k]][1][j] + "_1").style.color = color_map[k];
					}
				}
			}
		}
		
		// [vars_vals,param_vals] = match_values(C0,C1,vars,vars_vals,params,param_vals);
		
		// console.log('Variables: ');
		// console.log(join([vars',vars_vals'],'=')');
		// console.log('Parameters: ');
		// console.log(join([params',param_vals'],'=')');
	}
	
	return [C0,C1];
}

function generate_nested_array(S,C,Ci,p) {
	
	for(let i=0; i<S.length; i++) { // For each child element of parent p (with indices in ascending order (according to tree sorting)).
		if(S[i].parent_id == p) { // If this element is a child of element p.
			if(isNaN(S[i].type)) { // If it's a leaf.
				C.push(S[i].str); // Add the i-th child's str (param/number).
				Ci.push(S[i].id); // Also save its id.
			} else {
				C.push([S[i].operator]); // Add the i-th child operator.
				Ci.push([S[i].id]); // Also save its id.
				[C[C.length - 1],Ci[Ci.length - 1]] = generate_nested_array(S,C[C.length - 1],Ci[Ci.length - 1],S[i].id); // Repeat the process recursively for the i-th element's subtree.
			}
		}
	}
	
	return [C,Ci];
}

function compare_nested_arrays(C0,C1,op_score,leaf_score) {
	for(let i=0; i<C0.length; i++) { // For each pair of corresponding arrays of C0 and C1 in the current level (the first element in each level is the parent).
		if(C0[i].length == 1 && C1[i].length == 1) { // If both arrays have a single element in the i-th cell (and can thus be compared).
			if(typeof(C0[i]) == 'number' && typeof(C1[i]) == 'number') { // If both are not leafs (not letters).
				if(C0[i] != C1[i]) {
					op_score = op_score + 1;
				}
			} else if(typeof(C0[i]) == 'string' && typeof(C1[i]) == 'string') { // If both are leafs.
				if(C0[i] != C1[i]) {
					leaf_score = leaf_score + 1;
				}
			} else { // One is a leaf and one is not.
				op_score = op_score + 1;
				leaf_score = leaf_score + 1;
			}
		} else if(C0[i].length > 1 && C1[i].length > 1) { // If both arrays have multiple elements in the i-th cell.
			[op_score,leaf_score] = compare_nested_arrays(C0[i],C1[i],op_score,leaf_score);
		} else {// If one array has a single element and the other multiple elements in the i-th cell.
			// Compare only the first element.
		}
	}
	
	return [op_score,leaf_score];
}

function match_values(C0,C1,C1i,params) {
	
	for(let i=0; i<C0.length; i++) { // For each pair of corresponding cells of C0 and C1 in the current level (the first element in each level is the parent).
		if(typeof(C0[i]) == 'string' && typeof(C1[i]) == 'string' && isNaN(C0[i])) { // If both are leafs && the reference element is no a number (i.e., a variable or parameter).
			
			if(C0[i] in params && C1[i] != params[C0[i]][0]) { // If a value for this parameter already exists && this value is different from the current value.
				params[C0[i]] = [null]; // Set the value to NaN.
			} else if(C0[i] in params) { // If the parameter already exists in params and its value matches the previous value.
				params[C0[i]] = [ C1[i], [...params[C0[i]][1], C1i[i]] ];
			} else { // If the parameter does not yet exist in params.
				params[C0[i]] = [ C1[i], [C1i[i]] ];
			}
		} else if(C0[i].length > 1) {
			params = match_values(C0[i],C1[i],C1i[i],params);
		} // else - continue. Do nothing about non-leaf elements.
	}
	
	return params;
}