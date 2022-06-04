function postprocess_tree(S) {
	
	return add_level(S,null,0);
}

function add_level(S,p,level) {
	
	for(let i=0; i<S.length; i++) { // Search for elements with parent p.
		if(S[i].parent_id == p) { // If p is the parent of this element.
			S[i].level = level; // Assign level.
			S = add_level(S,S[i].id,level+1); // Run the function again with this element as the parent.
		}
	}
	
	return S;
}