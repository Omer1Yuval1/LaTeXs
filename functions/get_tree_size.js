function get_tree_size(S,p,treeSize) {
	
	// This functions gets an id of a node (tree element, parent_id) and returns the size of its sub-tree (the tree containing all its descendants).
	// The size is defined as an array such that each element corresponds to the number of nodes (tree elements) at a certain tree level.
	// Array indices correspond to tree levels such that smaller indices correspond to higher levels.
	// Note that this algorithm treats all elements at the same level in the same way (it is agnostic to how elements are spread under different parents within each level).
	
	if(arguments.length < 3) {
		var treeSize = [];
	}
	
	for(let i=0; i<S.id.length; i++) {
		if(S.parent_id[i] == p) { // If p is the parent of this element.
			
			
			
			if(treeSize[S.level[i]] == undefined) { // If this index does not yet exist.
				treeSize[S.level[i]] = 1;
			} else {
				treeSize[S.level[i]]++; // Increment by 1 the number of nodes at level S.level[i].
			}
			
			
			
			treeSize = get_tree_size(S,S.id[i],treeSize); // Run the function again with this element as the parent.
		}
	}
	
	return treeSize;
}