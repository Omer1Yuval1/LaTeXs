function index(test_ids,rep_vars,plot_01) {
	
	// cd(fileparts(which(mfilename)));
	// addpath(genpath(pwd));
	
	if(arguments.length == 0 || !test_ids.length) {
		var test_ids = 1;
	}
	
	if(arguments.length < 3) {
		var rep_vars = true;
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
		
		S = sort_tree(S,0);
		
		// just convert this structure to an object where each key is the id. then sort by id. then plot the tree using this object.
		
		var S_transformed = [];
		for(let i=0; i<S.id.length; i++) {
			S_transformed[i] = {};
			Object.keys(S).forEach(function(key) {
				S_transformed[i][key] = S[key][i];
			});
		}
		// console.log(S_transformed);
		
		// Sort the transformed S in increasing order of id:
		S_transformed.sort(function(a,b) {
			return a.id - b.id;
		});
		// console.log(S_transformed);
		
		if(rep_vars) {
			S = replace_var_names(S);
		}
		
		if(arguments.length < 3 || plot_01) {
			plot_AST(S_transformed,str[i],"#LaTex_AST");
			// plot_AST(S,str[i],"#LaTex_AST");
		}
	}
	
	return S;
}