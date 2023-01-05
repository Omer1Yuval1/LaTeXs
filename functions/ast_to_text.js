function ast_to_text(S) {
	/*
		Go over the AST from top to bottom, and from left to right.
		For each expression, the text will be determined by the operator type (e.g., middle or forward),
		and its specifics, specified in the operators database.
	*/
	
	// Middle operators
		// x^2: x squared.
		// x^3: x cubed.
		// x^n: x to the power of n.
	
	// Forward operators
		// \sum_{i}^{N} x: sum from i to N of x.
	
	const Ops = operators_database();
	
	var id = null;
	var ii = null; // The index of the current node in the operators database.
	var text = [];
	
	var parent_node = S.filter(x => x.parent_id === id)[0]; // Find the root node.
	text.push(...get_child_text(S, Ops, parent_node));
	
	/*
	var child_nodes = S.filter(x => x.parent_id === parent_node.id); // Find all child nodes of 'parent_node'.
	for(let i=0; i<child_nodes.length; i++) {
		text.push(...get_child_text(S, Ops, child_nodes[i]));
	}
	*/
	
	return text;
	
}

function get_child_text(S, Ops, parent_node) {
	var text = [];
	
	if(parent_node.operator >= 0) {
		
		let ii = Ops.index.indexOf(parent_node.operator); // Find the index of this operator in the database.
		
		let child_nodes = S.filter(x => x.parent_id === parent_node.id); // Find all child nodes of the parent operator.
		
		if(parent_node.type === 0) { // If it's a middle operator, two arguments are expected, and one string.
			for(let i=0; i<child_nodes.length; i++) {
				text.push(...get_child_text(S, Ops, child_nodes[i])); // Add the text for the i-th argument.
				
				if(i < child_nodes.length - 1) { // After all children, except for the last one,
					text.push(Ops.text[ii][0]); // Add the text for the operator itself.
				}
			}
		}
	} else {
		let ii = null;
		text.push(parent_node.str);
	}
	
	return text;
}