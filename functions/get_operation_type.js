function get_operation_type(ind) {
	
	var Ops = operators_database();
	
	if(ind > 0) {
		type = Ops.type[ind];
	} else {
		type = NaN;
	}
	
	return type;
}