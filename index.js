function index(test_ids,mode,plot) {
	
	if(arguments.length == 0 || !test_ids.length) {
		var test_ids = 1;
	}
	
	if(arguments.length < 2) {
		var mode = 1; // Sorted.
		var plot = "#LaTex_AST_0";
	}
	
	if(!isNaN(test_ids)) { // If it's a number.
		var str = [test_cases(test_ids)[0]]; // Load test cases.
	} else { // If a formula is given as an input string.
		var str = [test_ids];
	}
	
	for(let i=0; i< str.length; i++) { // i=1:length(str) {
		
		var S = {id: [], str: [], parent_id: [], operator: [], type: [], sign: [], level: []};
		
		let [str_i,is_good] = preprocess_input(str[i]);
		
		if(!is_good) {
			return S;
		}
		
		let [op_ind,op_priority,op_type] = op2ind('=',0);
		
		id = 0;
		S['id'].push(id);
		S['str'].push(str_i);
		S['parent_id'].push(null); // Top level.
		S['operator'].push(op2ind('=',0)[0]);
		S['type'].push(op_type);
		S['sign'].push('');
		S['level'].push(0);
		
		[S,undefined,undefined] = parse_formula(S,0,[id],op_ind,op_priority,op_type,[]);
		
		// Convert this structure to an object where each key is the id. then sort by id. then plot the tree using this object.
		var S_transformed = [];
		for(let i=0; i<S.id.length; i++) {
			S_transformed[i] = {};
			Object.keys(S).forEach(function(key) {
				S_transformed[i][key] = S[key][i];
			});
		}
		S = S_transformed;
		
		if(mode != 4) {
			S = simplify_tree(S);
		}
		
		S = postprocess_tree(S); // This add a "level" field to S.
		
		if(mode >= 1) {
			S = sort_tree(S,null);
		}
		
		// Sort the transformed S in increasing order of id:
		S.sort(function(a,b) {
			return a.id - b.id;
		});
		
		if(mode == 3) {
			S = replace_var_names(S);
		}
		
		if(plot) {
			plot_AST(S,str[i],plot);
		}
		
		console.log(S);
		
		var text = ast_to_text(S);
		console.log(text);
	}
	
	return [S, text];
}