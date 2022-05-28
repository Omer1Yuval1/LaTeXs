function postprocess_tree(S) {
	
	S = add_level(S,0,0);
	
	return S;
}

function add_level(S,p,level) {
	
	for(let ii=0; ii<S.id.length; ii++) { // Search for elements with p as their parent.
		if(S.parent_id[ii] == p) { // If p is the parent of this element.
			S.level[ii] = level; // Assign level.
			S = add_level(S,S.id[ii],level+1); // Run the function again with this element as the parent.
		}
	}
	
	return S;
}