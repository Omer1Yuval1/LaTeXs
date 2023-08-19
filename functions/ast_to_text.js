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
	text.push(...get_child_text(S, Ops, parent_node, false));
	
	text = text.join(" ");
	
	text = text.replace("plus minus", "minus");
	text = text.replace("to the power of 2", "squared");
	text = text.replace("to the power of 3", "cubed");
	text = text.replace("1th", "1st");
	text = text.replace("2th", "2nd");
	text = text.replace("3th", "3rd");
	text = text.replace("2nd root", "squared root");
	text = text.replace("3rd root", "cube root");
	
	let A = [["R", "real"], ["Q", "rational"], ["R'", "irrational"], ["N", "natural"], ["Z", "integer"], ["C", "complex"], ["I", "imaginary"], ]
	for(let op of A) {
		text = text.replace("in " + op[0] + " numbers", "be " + op[1]);	
		text = text.replace(op[0] + " numbers", op[1] + " numbers");	
	}
	
	text = text.replace(/([a-z]) comma ([a-z]) comma ([a-z])/, "$1, $2 and $3");
	
	text = text.replace("a ", " `a` ");
	
	return text;
	
}

function get_child_text(S, Ops, parent_node, skip) {
	var text = [];
	
	let child_nodes = S.filter(x => x.parent_id === parent_node.id); // Find all child nodes of the parent operator.
	
	if(parent_node.operator >= 0) {
		
		if(!skip) {
			let ii = Ops.index.indexOf(parent_node.operator); // Find the index of this operator in the database.
			
			if(parent_node.operator === 10) { // If it's a "(".
				if(parent_node.sign) {
					text.push("minus ");
					text.push("...");
				}
				text.push(...get_child_text(S, Ops, child_nodes[0], false));
			} else if(parent_node.type === 0 || parent_node.type === 1) { // If it's a middle operator, two arguments are expected, and one string.
				for(let i=0; i<child_nodes.length; i++) {
					text.push(...get_child_text(S, Ops, child_nodes[i], false)); // Add the text for the i-th argument.
					
					if(i < child_nodes.length - 1) { // After all children, except for the last one,
						text.push(Ops.text[ii][0]); // Add the text for the operator itself.
					}
				}
			} else if(parent_node.type === 3) { // Forward opertor with non-simple inputs (e.g., \\sum, \\int, \\lim).
				text.push(Ops.text[ii][0]); // Add the text for the operator itself.
				
				for(let i=0; i<child_nodes.length; i++) {
					
					let arg_i = Ops.argument_list[ii].indexOf(child_nodes[i].operator); // Find the index of child i in the argument list of its parent.
					if(arg_i > -1) {
						text.push(Ops.text[ii][arg_i + 1]);
						text.push(...get_child_text(S, Ops, child_nodes[i], true));
					} else if(child_nodes[i].operator == 10 && Ops.argument_list[ii].indexOf(9)) {
						arg_i = Ops.argument_list[ii].indexOf(9);
						text.push(Ops.text[ii][arg_i + 1]);
						text.push(...get_child_text(S, Ops, child_nodes[i], true));
					}
				}
				
			} else if(parent_node.type === 6) {
				text.push(Ops.text[ii][0]); // Add the text for the operator itself.
				text.push(...get_child_text(S, Ops, child_nodes[0], false));
			} else if(Ops.operator[ii] === '\\sqrt') {
				text.push("the " + child_nodes[0].str + "th");
				text.push(Ops.text[ii][0]); // Add the text for the operator itself.
				text.push(child_nodes[1].str );
			} else if(parent_node.type === 2) { // Forward opertor with simple inputs (e.g., \\mathbb).
				text.push(...get_child_text(S, Ops, child_nodes[0], false));
				text.push(Ops.text[ii][0]); // Add the text for the operator itself.
			}
		} else {
			text.push(...get_child_text(S, Ops, child_nodes[0], false));
		}
	} else {
		// let ii = null;
		if(parent_node.sign) {
			text.push("minus");
		}
		text.push(parent_node.str);
		
		if(child_nodes.length > 0) {
			text.push(...get_child_text(S, Ops, child_nodes[0], false));
		}
	}
	
	return text;
}