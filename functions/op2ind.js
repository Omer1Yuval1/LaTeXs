function op2ind(str,i) {
	
	// This function gets an operator as a string (this can be either a single character or a LaTex command).
	// It returns the unique index (int) of the operation (ind), as well as its symbol (sym).
	
	// var P = parameters();
	var Ops = operators_database();
	var P = parameters();
	
	// Set the default to be a middle operator with two arguments (one before and one after):
	var type = 0;
	var arg_list = NaN;
	var priority = NaN;
	var is_commutative = NaN;
	let str_i;
	
	if(str[i] == '\\') { // Find the operator in the operators database.
		
		str = str.slice(i).match(/(\\[a-z]+)/g)[0];
		
		var fop = Ops.operator.indexOf(str);
		var di = Ops.operator[fop].length;
		var sym = Ops.symbol[fop];
		var ind = Ops.index[fop];
		var type = Ops.type[fop];
		var arg_num = Ops.argument_num[fop];
		var arg_list = Ops.argument_list[fop];
		var priority = Ops.priority[fop];
		var is_commutative = Ops.commutative[fop];
	} else if(Ops.operator.indexOf(str[i]) > -1) { // If it's a single character operator.
		
		var sym = str[i];
		var di = 1;
		
		var fop = Ops.operator.indexOf(str[i]);
		var ind = Ops.index[fop];
		var priority = Ops.priority[fop];
		var type = Ops.type[fop];
		var arg_num = Ops.argument_num[fop];
		var arg_list = Ops.argument_list[fop];
		var is_commutative = Ops.commutative[fop];
	} else if(str_i = str.slice(i).match(/^[0-9]+[.]{1}[0-9]+/g)) { // A decimal number (must come before the next condition for matching an integer).
		str_i = str_i[0];
		var ind = -3; // Number.
		var type = NaN;
		var di = str_i.length;
		var sym = str_i;
	} else if(str_i = str.slice(i).match(/^[0-9]+/g)) { // An integer number.
		str_i = str_i[0];
		var ind = -3; // Number.
		var type = NaN;
		var di = str_i.length;
		var sym = str_i;
	} else if(str_i = str.slice(i).match(/^[a-zA-Z]{1}/g)) { // A letter(s).
		if(!is_func(str.slice(i),1,[0,0],[0,0,0],0)[0] || ['_','^'].includes(str[i-1]) || !P.function_letters.includes(str_i[0])) { // If it is not a function (i.e., a variable/parameter).
			str_i = str_i[0];
			var ind = -2;
			var di = 1;
			var sym = str_i;
			type = NaN;
		} else { // If it is a function.
			str_i = str_i[0];
			var ind = -1;
			var di = 1;
			var sym = str_i;
			type = 3;
			arg_list = [2,1,10]; // ['_','^','('].
			priority = 2;
			is_commutative = false;
		}
		// var [is_func,undefined] = is_func(str.slice(i),1,[0,0],[0,0,0],0);
	} else { // Space.
		var ind = NaN;
		var di = 1;
		var sym = NaN;
		var type = -1;
	}
	
	return [ind,priority,type,sym,di,arg_list,is_commutative];
}