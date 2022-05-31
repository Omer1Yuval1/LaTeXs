function plot_AST(S,str0,container) {
	
	// TODO:
		// Add elements in order according to their id.
			// Create an array of [id,row] pairs. Sort it by id. Then loop over the sorted row numbers.
			
	// var P = parameters();
	var Ops = operators_database();
	
	// Replace this with a loop that converts S into this data structure:
	var AST = {
		chart: {
			container: container // This refers to the id of the DIV element.
		},
		nodeStructure: {
			text: { name: "S" },
			children: []
		}
	};
	
	AST.nodeStructure.children = add_subtree_nodes(S,null,AST.nodeStructure.children);
	
	var my_chart = new Treant(AST);
	
}

function add_subtree_nodes(S,p,AST) {
	var Ops = operators_database();
	for(let i=0; i<S.id.length; i++) { // Search for elements with p as their parent.
		if(S.parent_id[i] == p) { // If p is the parent of this element.
			if(S.operator[i] > 0) { // If it's an operator.
				var temp = { text: { name: Ops.symbol[Ops.index.indexOf(S.operator[i])] }, children: add_subtree_nodes(S,S.id[i],[]) };
				AST.push(temp); // Add child of parent p.
				// AST[].children = []; // Add a children node.
				// AST[].children = add_subtree_nodes(S,S.id[i],AST.children); // Run the function again with this element as the parent.
			} else { // If it's a leaf element.
				AST.push({ text: { name: S.str[i] } });
			}
		}
	}
	
	return AST;
}