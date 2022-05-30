function get_tree_size(S,p) {
	
	// This functions gets an id of a node (tree element, parent_id) and returns the size of its sub-tree (the tree containing all its descendants).
	// The size is defined as an array such that each element corresponds to the number of nodes (tree elements) at a certain tree level.
	// Array indices correspond to tree levels such that smaller indices correspond to higher levels.
	// Note that this algorithm treats all elements at the same level in the same way (it is agnostic to how elements are spread under different parents within each level).
	
	var treeSize = [];
	
	treeSize = get_tree_size(S,p,treeSize); // Iterate recursively over the whole tree. Count the number of nodes within each level that belong to the subtree of element p.
	
	return treeSize;
}
	
function get_tree_size(S,p) {
	
	for(let i=0; i<S.id.length; i++) {
		if(S.parent_id[i] == p) { // If p is the parent of this element.
			if(treeSize[S.level[i]] == undefined) { // If this key does not yet exist.
				treeSize[S.level[i]] = 0;
			} else {
				treeSize[S.level[i]]++; // Increment by 1 the number of nodes at level S.level[i].
			}
			treeSize = get_tree_size(S,S.id[i],treeSize); // Run the function again with this element as the parent.
		}
	}
	
	return treeSize;
}
	
	/*
	
	var Nv = 0; // Counter of the number of direct child nodes of parent_id.
	Nvv = {}; // An object for storing tree size information. Each element contains the number of nodes at a certain level. The key is the row number in S of a child of parent_id.
	var Lmax = 0; // Maximum number of levels across all children at this level.
	
	for(let i=0; i<S.id.length) {
		if(S.parent_id[i] == parent_id) { // If the i-th element is a child of element parent_id.
			Nv++;
			Nvv.i = get_tree_size(S,S.id[i]); // Get the size array of the sub-tree of the i-th element (S.id[i]).
			
			Lmax = Math.max(Lmax,Nvv.i); // Update the maximum number of levels.
		}
	}
	
	Nvv = ; // Add zeros to have all the same length, and then add up the arrays from all cells.
	Nv = [...Nv, ...Nvv]; // Concaternate the total size array to the number of elements at this level.
	
	Nvv = {0: [3,4,6,2], 1: [4,2,4], 2: [3,7,1]}
	Vals = Object.values(obj);
	keys = Object.keys(obj);
	for(let i=0; i < Lmax; i++) {
		Nvv[] = 
		c.push((a[i] || 0) + (b[i] || 0));
	}
	
	
	
	if(Nv) { // If there is at least one child.
		let Nvv = cell(1,Nv);
		
		for(let ii=; ii<Nv; ii++) { // For each child element.
			Nvv{ii} = get_tree_size(S,S(Fpp(ii)).id); // Get the size array of the sub-tree of element Fpp(ii).
		}
		
		let Lmax = max(cellfun(@length,Nvv)); // Maximum number of levels across all children at this level.
		Nvv = sum(cell2mat(transpose(cellfun(@(x) [x,zeros(1,Lmax-length(x))],Nvv,'UniformOutput',false))),1); // Add zeros to have all the same length, and then add up the arrays from all cells.
		
		Nv = [Nv,Nvv]; // Concaternate the total size array to the number of elements at this level.
	} else {
		Nv = [];
	}
	
	return Nv;
}
*/