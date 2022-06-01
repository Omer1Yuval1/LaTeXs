function postprocess_tree(S) {
	
	return add_level(S,null,0);
}

function add_level(S,p,level) {
	
	for(let i=0; i<S.id.length; i++) { // Search for elements with parent p.
		if(S.parent_id[i] == p) { // If p is the parent of this element.
			S.level[i] = level; // Assign level.
			S = add_level(S,S.id[i],level+1); // Run the function again with this element as the parent.
		}
	}
	
	return S;
}