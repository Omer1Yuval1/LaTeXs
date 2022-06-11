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
			HTMLid: "S",
			children: []
		}
	};
	
	AST.nodeStructure.children = add_subtree_nodes(S,null,[],container[container.length-1]);
	
	var my_chart = new Treant(AST);
	
	// MathJax.typeset([document.getElementById(container)]); // Compile LaTex in AST.
	
}

// I could modify this function to collect all child nodes of p, and then go over them in their id order.

function add_subtree_nodes(S,p,AST,n) {
	var Ops = operators_database();
	for(let i=0; i<S.length; i++) { // Search for elements with p as their parent.
		if(S[i].parent_id == p) { // If p is the parent of this element.
			if(S[i].operator >= 0) { // If it's an operator.
				let s = Ops.index.indexOf(S[i].operator);
				
				if([9,10,11,12].includes(s)) {
					var sym = S[i].sign + Ops.symbol[s] + Ops.symbol[s+4];
				} else {
					var sym = S[i].sign + Ops.symbol[s];
				}
				
				var temp = { text: { name: sym }, HTMLid: "node_" + S[i].id.toString() + "_" + n, children: add_subtree_nodes(S,S[i].id,[],n) };
				AST.push(temp); // Add child of parent p.
			} else { // If it's a leaf element.
				let sym = S[i].sign + op2ind(S[i].str,0)[3];
				AST.push({ text: { name: sym }, HTMLid: "node_" + S[i].id.toString() + "_" + n, children: add_subtree_nodes(S,S[i].id,[],n) });
			}
		}
	}
	
	return AST;
}