function simplify_tree(S) {
	// TODO:
		// {} is actually {=}. If removed, they sometimes need to be replaced by =.
			// If they have 2 direct children, then it must be an equation/comparison.
		// Remove elements (nodes) with a single child and connect their child and parent (I think that's wrong and too general).
			// Parenthesis as a single child of a +.
		// Associativity: x*(y*z) = x*y*z.
		// Check test case 58 (a * is a child of a *).
		// Any parenthesis with a single child.
			// Then if an associative && commutative operator has the same operator as a child, merge them into one group under the parent (remove the child operator).
				// Example: 'x*(y*z)'.
			// I might want to avoid changing such things.
		// Possibly merge labels of merged nodes.
		// I need to keep parentheses that belong to latex operations. Probably can just keep all {} and [].
	
	
	// Rules
		// If a + has only one child, remove the +. This will automatucally account for cases with a comparison operator that has two or more + children. See test case 51+52.
		// If an = has only one child, remove the =. Sometimes the = will be in the form {=} or (=). See test case 42.
			// But perhaps in some cases the () are important, such as in cos(x+1). Or maybe not.
			// For some operator types, [] and {} (as well as ^ and _) refer to specific arguments. See test case 58.
		// Remove () (index = 10) if it has one child. See test case 53 + 19-24.
		
		// TODO:
			// ***** Can't remove elements with a minus sign.
			// Remove {} only if they have one child, but only if their parent is:
				// frac (index = 17). See test case 35.
				// type=0 (middle operators with no special inputs). See test case 35.
				// type=1 (complex middle operators - comparison). See test case 37 and 60.
			// If {} or () has more than one direct child, replace it with =.
			// remove * if its parent is also *.
	
	var toRemove = [];
	for(let i=0; i<S.length; i++) {
		if(S[i].operator == 3 || S[i].operator == 4 || S[i].operator == 10) { // '+' || '=' || ().
			let Cn = get_children(S,S[i].id); // Cn is an array of child indices (positions, not ids) in S.
			if(Cn.length <= 1) { // If it has up to 1 (direct) child.
				for(let j=0; j<Cn.length; j++) { // Update the parent_id of the children to be the parent of their parent.
					S[Cn[j]].parent_id = S[i].parent_id;
				}
				toRemove.push(i); // Mark the parent for removal.
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