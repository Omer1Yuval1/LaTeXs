function get_operation_details(category) {
	
	switch(category) {
		case 'func':
			operation = -1;
			type = 3;
			break;
		case 'letter':
			operation = -2;
			type = NaN;
			break;
		case 'number':
			operation = -3;
			type = NaN;
			break;
		default:
			operation = NaN;
			type = NaN;
	}
	
	return [operation,type];
}