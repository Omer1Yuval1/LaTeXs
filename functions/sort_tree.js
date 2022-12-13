function sort_tree(S,p) {
	
	// This algorithm sorts a given tree (directed graph) in a top-down manner.
	// For each level, it first considers level-specific features (such as operator and leaf type).
	// Then, as a secondary sorting condition, it sorts by tree size.
	// Tree size is an array containing the number of elements within each level of a sub-tree (see get_tree_size.m for more information).
	// (not yet used) In addition, every elemets are assigned with sub-id, corresponding to their order as direct children of a parent element.
	// Note that numbers are sorted in decreasing absolute size (i.e., regardless of their sign).
	
	// var P = parameters();
	var Ops = operators_database();
	var treeSize;
	
	// Find the index of element id=p
	var ii = NaN;
	for(let i=0; i<S.length; i++) {
		if(S[i].id == p) {
			ii = i; // Find the index of the parent element using its id.
			break;
		}
	}
	
	if(!isNaN(ii) && !isNaN(S[ii].type) && Ops.commutative[Ops.index.indexOf(S[ii].operator)]) { // If it's an operator (i.e., not a leaf element) and is commutative.
		
		var arr = []; // Create an array of elements with properties for sorting.
		var new_ids = []; // An array of child node ids that will be used to reassign ids after sorting.
		
		for(let i=0; i<S.length; i++) {
			if(S[i].parent_id == p) { // If the i-th element is a child of element p.
				
				treeSize = get_tree_size(S,S[i].id); // This produces an array of node counts per level (higher levels appear first).
				treeSize = treeSize.filter(Number); // This just removes undefined values (missing level keys).
				
				// Assign numeric value (or NaN if not a leaf element):
				let num_val = NaN;
				if(isNaN(S[i].type)) { // If it's a leaf element.
					if(isNaN(S[i].str)) { // If its NOT a number.
						num_val = S[i].str.charCodeAt(0); // Get the numeric Unicode of the first letter.
					} else { // If it's a number.
						num_val = Number(S[i].sign + S[i].str);
					}
				}
				
				arr.push([S[i].operator, treeSize, num_val, S[i].id, i]); // Note that treeSize is itself an array. The id and i (row number) are only saved for later use (not for sorting).
				new_ids.push(S[i].id);
			}
		}
		
		if(new_ids.length > 1) { // Sorting and permuting child nodes only makes sense if there are at least two of them.
			
			// Sort the arr object (first by operator, then by tree size, and finally by numeric value):
			arr.sort(function(a,b) { // Smallest comes first.
				let Nab = Math.max(a[1].length,b[1].length); // The maximum length of the tree-size arrays.
				if(a[0] != b[0]) { // Sort by operator.
					return b[0] - a[0];
				} else if(a[1].slice(0,Nab)+"" != b[1].slice(0,Nab)+"" || a[1].length != b[1].length) { // Sort by tree size. Do this only if the arrays are not identical (up to Nab) or if they have different size (this means that they can be sorted by tree size for sure).
					for(let i=0; i<Nab; i++) { // Compare the size arrays, until they are different or until one of them is over.
						if(a[1][i] != b[1][i]) {
							if(a[1][i] == undefined && b[1][i] != undefined) {
								return 1;
							} else if(a[1][i] != undefined && b[1][i] == undefined) {
								return -1;
							} else {
								return b[1][i] - a[1][i];
							}
						} // otherwise continue to compare the next pair of elements.
					}
				} else { // Sort by numeric value.
					return b[2] - a[2]; // Larger numbers come first (e.g., 2 before 1). Later letters come first (e.g., x before a).
				}
			});
			
			// After sorting all child nodes of parent p, update their ids accordingly:
				// Note that if an id changes, the parent id of all of its child nodes must be updates too.
			new_ids = new_ids.sort(function(a, b){return a - b}); // Sort the array of child node id, in order to use them to reassign ids to sorted child nodes.
			
			for(let j=0; j<arr.length; j++) { // For each child of element p, in their sorted order.
				S[arr[j][4]].id = -new_ids[j]; // Assign the new id with a negative sign.
				for(let i=0; i<S.length; i++) { // Then find its children.
					if(S[i].parent_id == arr[j][3]) { // If the i-th element is a child of element arr.childKeys[j][3] (which stores the id of a child of p).
						S[i].parent_id = -new_ids[j];
					}
				}
			}
			
			// Change all negative ids (including parent_ids) back to positive:
			for(let i=0; i<S.length; i++) {
				if(S[i].id < 0) {
					S[i].id = -S[i].id;
				} else if(S[i].parent_id < 0) {
					S[i].parent_id = -S[i].parent_id;
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
	
	// Run the function recursively for each child of element p
	for(let i=0; i<S.length; i++) {
		if(S[i].parent_id == p) { // If the i-th element is a child of element p.
			S = sort_tree(S,S[i].id);
		}
	}
	
	return S;
	
}