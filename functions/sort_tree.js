function sort_tree(S,p) {
	
	// This algorithm sorts a given tree (directed graph) in a top-down manner.
	// For each level, it first considers level-specific features (such as operator and leaf type).
	// Then, as a secondary sorting condition, it sorts by tree size.
	// Tree size is an array containing the number of elements within each level of a sub-tree (see get_tree_size.m for more information).
	// (not yet used) In addition, every elemets are assigned with sub-id, corresponding to their order as direct children of a parent element.
	
	// var P = parameters();
	var Ops = operators_database();
	
	var ii = S.id.indexOf(p); // Find the index of the parent element using its id.
	
	if(!isNaN(S.type[ii]) && Ops.commutative[Ops.index.indexOf(S.operator[ii])]) { // If it's an operator (i.e., not a leaf element) and is commutative.
		
		var arr = []; // Create an array of elements with properties for sorting.
		var new_ids = []; // An array of child node ids that will be used to reassign ids after sorting.
		
		for(let i=0; i<S.id.length; i++) {
			if(S.parent_id[i] == p) { // If the i-th element is a child of element p.
				
				treeSize = get_tree_size(S,S.id[i]); // This produces an array of node counts per level (higher levels appear first).
				
				// Assign numeric value (or NaN if not a leaf element):
				let num_val = NaN;
				if(isNaN(S.type[i])) { // If it's a leaf element.
					if(isNaN(S.str[i])) { // If its NOT a number.
						num_val = S.str[i].charCodeAt(0); // Get the numeric Unicode of the first letter.
					} else { // If it's a number.
						num_val = Number(S.str[i]);
					}
				}
				
				arr.push([S.operator[i], treeSize, num_val, S.id[i], i]); // Note that treeSize is itself an array. The id and i (row number) are only saved for later use (not for sorting).
				new_ids.push(S.id[i]);
			}
		}
		
		if(new_ids.length > 1) { // Sorting and permuting child nodes only makes sense if there are at least two of them.
			
			// Sort the arr object (first by operator, then by tree size, and finally by numeric value):
			arr.sort(function(a,b) { // Smallest comes first.
				let Nab = Math.min(a[1].length,b[1].length); // The minimum length of the tree-size arrays.
				if(a[0] != b[0]) { // Sort by operator.
					return b[0] - a[0];
				} else if(a[1].slice(0,Nab)+"" != b[1].slice(0,Nab)+"") { // Sort by tree size. Do this only if the arrays are not identical (up to Nab).
					for(let i=0; i<Nab; i++) { // Compare only the mutual keys of a and b (up to Nab).
						if(a[1][i] != b[1][i]) {
							return a[1][i] - b[1][i];
						} // otherwise continue to compare the next pair of elements.
					}
				} else { // Sort by numeric value.
					return a[2] - b[2];
				}
			});
			
			// After sorting all child nodes of parent p, update their ids accordingly:
				// Note that if an id changes, the parent id of all of its child nodes must be updates too.
			new_ids = new_ids.sort(function(a, b){return a - b}); // Sort the array of child node id, in order to use them to reassign ids to sorted child nodes.
			
			for(let j=0; j<arr.length; j++) { // For each child of element p, in their sorted order.
				S.id[arr[j][4]] = -new_ids[j]; // Assign the new id with a negative sign.
				for(let i=0; i<S.id.length; i++) { // Then find its children.
					if(S.parent_id[i] == arr[j][3]) { // If the i-th element is a child of element arr.childKeys[j][3] (which stores the id of a child of p).
						S.parent_id[i] = -new_ids[j];
					}
				}
			}
			
			// Change all negative ids (including parent_ids) back to positive:
			for(let i=0; i<S.id.length; i++) {
				if(S.id[i] < 0) {
					S.id[i] = -S.id[i];
				} else if(S.parent_id[i] < 0) {
					S.parent_id[i] = -S.parent_id[i];
				}
			}
			
			/*
			for(let i=0; i<new_ids.length; i++) {
				// S.sub_id[] = i;
				S = sort_tree(S,new_ids[i]);
			}
			*/
		}
	}
	
	for(let i=0; i<S.id.length; i++) {
		if(S.parent_id[i] == p) { // If the i-th element is a child of element p.
			S = sort_tree(S,S.id[i]);
		}
	}
	
	return S;
	
}