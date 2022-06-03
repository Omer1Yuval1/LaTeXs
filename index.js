function index(test_ids,mode,plot) {
	
	// cd(fileparts(which(mfilename)));
	// addpath(genpath(pwd));
	
	if(arguments.length == 0 || !test_ids.length) {
		var test_ids = 1;
	}
	
	if(arguments.length < 2) {
		var mode = 1; // Sorted.
		var plot = "#LaTex_AST_0";
	}
	
	if(!isNaN(test_ids)) { // If it's a number.
		var str = [test_cases(test_ids)]; // Load test cases.
	} else { // If a formula is given as an input string.
		var str = [test_ids];
	}
	
	for(let i=0; i< str.length; i++) { // i=1:length(str) {
		// disp(str{i});
		// disp(test_ids(i));
		
		var S = {id: [], str: [], parent_id: [], operator: [], type: [], sign: [], level: []};
		
		let str_i = preprocess_input(str[i]);
		
		[op_ind,op_priority,op_type,undefined,undefined,undefined,undefined] = op2ind('=',0);
		
		id = 0;
		S['id'].push(id);
		S['str'].push(str_i);
		S['parent_id'].push(null); // Top level.
		S['operator'].push(op2ind('=',0)[0]);
		S['type'].push(op_type);
		S['sign'].push('');
		S['level'].push(0);
		
		[S,undefined,undefined] = parse_formula(S,0,id,op_ind,op_priority,op_type,[]);
		
		S = postprocess_tree(S);
		
		if(mode >= 1) {
			S = sort_tree(S,0);
		}
		
		// just convert this structure to an object where each key is the id. then sort by id. then plot the tree using this object.
		
		var S_transformed = [];
		for(let i=0; i<S.id.length; i++) {
			S_transformed[i] = {};
			Object.keys(S).forEach(function(key) {
				S_transformed[i][key] = S[key][i];
			});
		}
		S = S_transformed;
		// console.log(S_transformed);
		
		// Sort the transformed S in increasing order of id:
		S.sort(function(a,b) {
			return a.id - b.id;
		});
		// console.log(S);
		
		// S = simplify_tree(S);
		
		if(mode >= 2) {
			S = replace_var_names(S);
		}
		
		if(plot) {
			plot_AST(S,str[i],plot);
		}
	}
	
	return S;
}