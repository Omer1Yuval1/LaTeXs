function get_operation_type(ind) {
	
	var Ops = operators_database();
	
	if(ind > 0) {
		type = Ops(ind).type;
	} else {
		type = nan;
	}
	
	return type;
}