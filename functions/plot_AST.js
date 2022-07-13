function plot_AST(S,str0,container) {
	
	var Ops = operators_database();
	
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
	
}

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
			} else if(S[i].operator == -1) { // If it's a function.
				var sym = S[i].sign + 'function (' + op2ind(S[i].str,0)[3] + ')';
			} else { // If it's a leaf element.
				var sym = S[i].sign + op2ind(S[i].str,0)[3];
			}
			
			let temp = { text: { name: sym }, HTMLid: "node_" + S[i].id.toString() + "_" + n, children: add_subtree_nodes(S,S[i].id,[],n) };
			AST.push(temp); // Add child of parent p.
		}
	}
	
	return AST;
}