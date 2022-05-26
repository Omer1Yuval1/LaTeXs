function op2ind(str,i) {
	
	// This function gets an operator as a string (this can be either a single character or a LaTex command).
	// It returns the unique index (int) of the operation (ind), as well as its symbol (sym).
	
	var P = parameters();
	var Ops = operators_database();
	
	// Set the default to be a middle operator with two arguments (one before and one after):
	var type = 0;
	var arg_list = NaN;
	var priority = NaN;
	var is_commutative = NaN;
	
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
	} else if(str = str.slice(i).match(/^[0-9]+[.]{1}[0-9]+/g)[0]) { // A decimal number (must come before the next condition for matching an integer).
		var ind = 0;
		var type = NaN;
		var di = str.length;
		var sym = str;
	} else if(str = str.slice(i).match(/^[0-9]+/g)[0]) { // An integer number.
		var ind = 0;
		var type = NaN;
		var di = str.length;
		var sym = str;
	} else if(str = str.slice(i).match(/^[a-zA-Z]{1}/g)[0]) { // A letter.
		var ind = 0;
		var type = NaN;
		var di = 1;
		var sym = str[i];
	} else { // Space.
		var ind = NaN;
		var di = 1;
		var sym = NaN;
		var type = -1;
	}
	
	return [ind,priority,type,sym,di,arg_list,is_commutative];
}