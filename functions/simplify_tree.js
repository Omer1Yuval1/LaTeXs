function simplify_tree(S) {
	
	// Rules
		// ***** Can't remove operator elements with a minus sign.
		// If a + has only one child, remove the +. This will automatucally account for cases with a comparison operator that has two or more + children. See test case 51+52.
		// If an = has only one child, remove the =. Sometimes the = will be in the form {=} or (=). See test case 42.
			// But perhaps in some cases the () are important, such as in cos(x+1). Or maybe not.
			// For some operator types, [] and {} (as well as ^ and _) refer to specific arguments. See test case 58.
		// Remove () (index = 10) if it has one child. See test case 53 + 19-24.
		// Remove {} only if they have one child, but only if their parent is:
			// frac (index = 17). See test case 27 + 35.
			// type=0 (middle operators with no special inputs). See test case 35.
			// type=1 (complex middle operators - comparison). See test case 37 + 60.
		// If {} or () has more than one direct child, replace it with =. See test case 42 + 56, 58-59.
		// remove * if its parent is also *. See test case 58.
	
	var toRemove = [];
	for(let i=0; i<S.length; i++) {
		if(S[i].operator == 3 || S[i].operator == 4) { // '+' (3) || '=' (4) || () (10).
			if(S[i].sign != '-') { // If it does not have a minus sign.
				let Cn = get_children(S,S[i].id); // Cn is an array of child indices (positions, not ids) in S.
				if(Cn.length <= 1) { // If it has up to 1 (direct) child.
					for(let j=0; j<Cn.length; j++) { // Update the parent_id of the children to be the parent of their parent.
						S[Cn[j]].parent_id = S[i].parent_id;
					}
					toRemove.push(i); // Mark the parent for removal.
				}
			}
		} else if([9,10,11].includes(S[i].operator) && S[i].sign != '-') { // {}[] without a minus sign.
			let Cn = get_children(S,S[i].id);
			if(Cn.length <= 1) { // If it has up to 1 (direct) child.
				for(let ii=0; ii<S.length; ii++) { // First find the parent of the {}.
					if(S[i].parent_id == S[ii].id) {
						if([0,1,2].includes(S[ii].type)) { // If the parent of the {} is \frac || type == 0 (^) || type == 1 (.e.,g \in) || type == 2 (\frac, \sqrt).
							for(let j=0; j<Cn.length; j++) { // Update the parent_id of the children to be the parent of their parent.
								S[Cn[j]].parent_id = S[i].parent_id;
							}
							toRemove.push(i); // Mark the parent for removal.
						}
						break; // There is only parent, so break once it is found.
					}
				}
			} else { // If it has 2+ children, keep it, but change it to =.
				var [op_ind,undefined,op_type,op_sym,undefined,undefined,undefined] = op2ind('=',0);
				S[i].str = '='; 
				S[i].operator = op_ind;
				S[i].type = op_type;
			}
		} else if(S[i].operator == 0) { // *.
			for(let ii=0; ii<S.length; ii++) { // First find the parent of the {}.
				if(S[i].parent_id == S[ii].id && S[ii].operator == 0) { // * is a child of a *.
					let Cn = get_children(S,S[i].id); // Get the children of the child *.
					for(let j=0; j<Cn.length; j++) { // Update the parent_id of the children to be the parent of their parent.
						S[Cn[j]].parent_id = S[i].parent_id;
					}
					toRemove.push(i); // Mark the child '*' for removal.
					break;
				}
			}
		}
	}
	
	// Remove elements:
	toRemove.sort(function(a, b){return a - b}); // Sort in ascending order.
	var d = 0;
	for(let i=0; i<toRemove.length; i++) {
		S.splice(toRemove[i] - d,1); // Remove the parent.
		d++;
	}
	
	return S;
}

function get_children(S,p) {
	var Cn = [];
	for(let i=0; i<S.length; i++) {
		if(S[i].parent_id == p) {
			Cn.push(i);
		}
	}
	return Cn;
}