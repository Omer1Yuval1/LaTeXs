function is_func(str,i,arg_count,par_count,level) { // This function detects whether a letter is followed by (), possibly with other '_' and '^' arguments in between.
	
	// Run examples
		// var [answer,i] = is_func('f_(i)^(k)(',1,[0,0],[0,0,0],0);
		// var [answer,i] = is_func('f_(i)_()(',1,[0,0],[0,0,0],0);
		// var [answer,i] = is_func('f_(x)^{}a(',1,[0,0],[0,0,0],0);
		// var [answer,i] = is_func('f_(x)^{}*(',1,[0,0],[0,0,0],0);
		// n(n+1);
	
	while(i < str.length) {
		switch(str[i]) {
			case '(':
				if(level == 0 && par_count.every((v) => v == 0)) { // If all parentheses are balanced.
					return [true,i]; // It is a function.
				} else {
					par_count[1]++;
					break;
				}
			case '_':
				if(level == 0) {
					var [undefined,i] = is_func(str,i+1,[],par_count,level+1);
					if(arg_count[0] == 1) {
						return [false,i];
					}
					arg_count[0]++; // Track the number of '_' only at level 0.
				}
				break;
			case '^':
				if(level == 0) {
					var [undefined,i] = is_func(str,i+1,[],par_count,level+1);
					if(arg_count[1] == 1) {
						return [false,i];
					}
					arg_count[1]++; // Track the number of '^' only at level 0.
				}
				break;
			case '{':
				par_count[0]++;
				break;
			case '[':
				par_count[2]++;
				break;
			case '}':
				par_count[0]--;
				break;
			case ')':
				par_count[1]--;
				break;
			case ']':
				par_count[2]--;
				break;
			default:
				if(level == 0 && str[i] != ' ') {
					return [false,i];
				}
		}
		
		if(level > 0 && par_count.every((v) => v == 0)) { // If all parentheses are balanced.
			return [false,i];
		}
		i++;
	}
	
	return [false,i-1];
}