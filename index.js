function index(test_ids,rep_vars,plot_01) {
	
	// cd(fileparts(which(mfilename)));
	// addpath(genpath(pwd));
	
	if(arguments.length == 0 || !test_ids) {
		var test_ids = 1;
	}
	
	if(arguments.length < 3 || !rep_vars) {
		var rep_vars = 1;
	}
	
	if(!isNaN(test_ids)) { // If it's a number.
		var str = test_cases(test_ids); // Load test cases.
	} else { // If a formula is given as an input string.
		var str[0] = test_ids;
	}
	
	for(let i=0; i< str.length; i++) // i=1:length(str) {
		// disp(str{i});
		// disp(test_ids(i));
		
		let S = {id: [], str: [], parent_id: [], operator: [], type: []);
		
		str_i = preprocess_input(str[i]);
		
		[op_ind,op_priority,op_type] = op2ind('=',0);
		
		id = 1;
		S['id'].push(id);
		S['str'].push(str_i);
		S['parent_id'].push(0); // Top level.
		S['operator'].push(op2ind('=',1));
		S['type'].push(op_type);
		
		S = parse_formula(S,0,id,op_ind,op_priority,op_type,[]);
		
		S = postprocess_tree(S);
		
		S = sort_tree(S,0,0);
		
		if(rep_vars) {
			S = replace_var_names(S);
		}
		
		if(nargin < 3 || plot_01) {
			if(i == 1) {
				figure;
			}
			
			// set(gcf,'WindowState','Maximized');
			plot_AST(S,str[i]);
			set(gcf,'Name',num2str(test_ids[i]));
			// assignin('base','S',S);
			
			if(str.length > 1) {
				waitforbuttonpress;
				clf;
			}
		}
	}
	
	return S;
}