function parse_formula(S,p1,ids,op_ind_parent,op_priority_parent,op_type_parent,arg_list_parent) {
	
	var id = id0; // id0 is the parent id. id is the index of the currently parsed element.
	var id1 = id0; // id1 is the id of last parsed child element.
	var minus = '';
	var i = p1;
	
	var np = ids.length - 1; // The index of most recent parent (last index in 'ids').
	var id0 = ids[np];
	
	while(i < S.str[0].length) { // For each character.
		
		var [op_ind,op_priority,op_type,op_sym,di,arg_list,is_commutative] = op2ind(S.str[0],i);
		
		if(op_type_parent == 1 && op_type != 1 && op_type != -4) { // If the parent is a comparison operator (=,<,> etc.), but the current one is not, and is also not a closing parenthesis.
			
			// Create a plus element under the comparison element:
			var [op_ind_plus,op_priority_plus,op_type_plus,undefined,undefined,undefined,undefined] = op2ind('+',0);
			[S,id] = add_new_substring(S,id0,id,minus); // Add a new element for this operation.
			[S,p1] = end_substring(S,p1,i,id,op_ind_plus,op_type_plus); // Once done, close the current statement (up to the previous character).
			S.str[id] = '=+=';
			
			[S,id1,i] = parse_formula(S,p1,[...ids,id],op_ind_plus,op_priority_plus,op_type_plus,[]); // Go one level deeper. Set the '+' operator to be the parent operator in the inner level.
			if(i == S.str[0].length-1) {
				break;
			} else {
				continue;
			}
		}
		
		if(op_type == 5) { // Minus and \pm. These are not treated as normal operators, but are instead attached to the element that comes after them (leaf or brackets).
			minus = op_sym;
			i = i + 1;
			p1 = i;
			continue;
		}
		
		if(op_type == 0 || op_type == 1 || op_type == 6) { // If its a simple (*, ^) or non-simple (=, \in) middle operator .
			
			minus = '';
			
			if(op_priority < op_priority_parent || (op_priority == op_priority_parent && (op_ind != op_ind_parent || !is_commutative))) { // If the current operator has precedence over the parent operator (e.g., * < +).
				
				p1 = p1 + di; // Start the next element after the char+operator (TODO: this needs to be generalized for 2+ leafs).
				
				[S,id] = add_new_substring(S,id0,[],minus); // Add a new element for this operation.
				
				if(op_type_parent == 3 && arg_list_parent.slice(0,-1).includes(op_ind)) { // If the parent is a type 3 operator (e.g., \sum, \int, \lim), including an arbitrary function AND the current operator is included in the argument list, excluding the last argument (usually '{}' or '()').
					op_priority = NaN; // This switches middle operators like '^' into arguments.
				} else if(op_type == 6) { // Indexing.
					S.parent_id[id] = id1; // Just make it the child of the previous element.
				} else { // Feedback mechanism for middle operations.
					if(op_type == 1) { // If the parent is a comparison operator (=,<,> etc.).
						
						// Find the last child (that is an operator, not a leaf), of the last type 1 (comparison) element:
						let I = S.type.lastIndexOf(1); // Find the last (most recent) element of type 1 (comparison operator). Its index (=id) will be used to find its last child.
						let id_temp;
						for(let j=S.id.length-1; j>=0; j--) { // Go over elements in S backwards.
							if(S.parent_id[j] == I && S.operator[j] > 0) {
								id_temp = j;
								break;
							}
						}
						
						S.parent_id[id] = S.parent_id[id_temp];
						S.parent_id[id_temp] = id; // Make the new comparison element its parent.
						
						// Create a plus element under the comparison element:
						var [op_ind_plus,op_priority_plus,op_type_plus,undefined,undefined,undefined,undefined] = op2ind('+',0);
						[S,id1] = add_new_substring(S,id,[],minus); // Add a new element for this operation.
						[S,p1] = end_substring(S,p1,i,id1,op_ind_plus,op_type_plus); // Once done, close the current statement (up to the previous character).
						S.str[id1] = '=+=';
						
						[S,id1,i] = parse_formula(S,p1+di,[...ids, id1],op_ind_plus,op_priority_plus,op_type_plus,[]); // Go one level deeper. Set the '+' operator to be the parent operator in the inner level.
						
						[S,p1] = end_substring(S,p1,i-1,id,op_ind,op_type);
						S.str[id] = op_sym;
						
						if(i == S.str[0].length-1) {
							i = i + 1;
						}
						
						p1 = i;
						continue;
					} else { // Make the last element the child of the current one, and the current one the child of the parent of the last element.
						if(S.type[id1] == 6) { // If the last element is an index.
							id1 = S.id[S.id.indexOf(S.parent_id[id1])]; // Find the parent of the index and use it instead.
						}
						
						S.parent_id[id1] = id; // Make this new element the parent of the last closed element.
						S.str[id] = S.str[id1] + op_sym; // For the new element, add the str of the last closed element (before the operation) as an initial str (the rest will be added later).
					}
				}
				
				[S,id1,i] = parse_formula(S,i+di,[...ids, id],op_ind,op_priority,op_type,arg_list); // Go one level deeper. Send the current operator as the parent operator for the deeper leve.
				[S,p1] = end_substring(S,p1,i-1,id,op_ind,op_type); // Once done, close the current statement (up to the previous character).
				
				if(i < S.str[0].length-1) {
					if(op_type_parent == 3) { // If the parent is a type 3 operator (e.g., \sum, \int, \lim).
						let I = arg_list_parent.indexOf(op_ind); // Check if the current operator is included in the argument list of the parent, and get its index. Otherwise return -1.
						if(I > -1) {
							arg_list_parent.splice(I,1); // Remove the operator from the parent's arg_list.
						}
					}
					
					id1 = id;
					p1 = i;
					continue;
				} else {
					break;
				}
			} else if(op_priority_parent < op_priority || isNaN(op_priority_parent)) { // If the parent operator has precedence over the current operator (e.g., + > *).
				if(isNaN(S.operator[id])) {
					[S,p1] = end_substring(S,p1,i-1,id,op_ind,op_type); // Close the last statement. Return the previous char as last (operator not included).
				}
				id = id1; // This is done to return the latest id to the first outer level.
				
				break; // Break to go back one level up.
			} else if(op_ind == op_ind_parent) { // If the current and parent operators are identical and commutative.
				if(isNaN(S.operator[id1])) {
					[S,p1] = end_substring(S,p1,i-1,id1,op_ind,op_type);
				}
				i = i + 1;
				p1 = i;
				continue; // Simply continue creating new elemets at the same level, under the same parent.
			} else { // Same priority, different operator (or leaf).
				id1 = id;
				p1 = i;
				continue;
			}
		} else if(op_type == 4) { // If it is an opening parenthesis.
			
			var [op_ind_eq,op_priority_eq,op_type_eq,undefined,undefined,undefined,undefined] = op2ind('=',0);
			
			[S,id] = add_new_substring(S,id0,id,minus); // If there is no operator before the open parenthesis.
			
			S.type[id] = op_type_eq; // Temporarily assigning the parentheses with type = 1. This is so that inner level operators can detect it as a comparison operator.
			
			[S,undefined,i] = parse_formula(S,p1+di,[...ids, id],op_ind,op_priority_eq,op_type_eq,[]); // Go one level deeper. Set the '+' operator to be the parent operator in the inner level.
			i = Math.min(i+di-1,S.str[0].length-1);
			
			[S,p1] = end_substring(S,p1,i,id,op_ind,op_type); // Once done, close the current statement (up to the previous character).
			
			id1 = id;
			
			// Check the status of the arguments of the parent operator:
			if(arg_list_parent.length == 1 || arg_list_parent.includes(op_ind)) {
				arg_list_parent.splice(0,1); // Remove the first index that matched the current closing parenthesis.
				if(!arg_list_parent.length) { // If the argument list is empty.
					
					if(i < S.str[0].length-1 && !isNaN(op_priority_parent) && [9,10,11].includes(op2ind(S.str[0][i+1],0)[0])) {
						S.str[0] = S.str[0].slice(0,i+1) + '*' + S.str[0].slice(i+1); // Add * after the i-th characeter.
					}
					
					i = Math.min(i + 1,S.str[0].length);
					break; // If the arguments list is now empty, break back to the level of the latex operator.
				}
			} else if(op_type_parent == 0 && (op_priority_parent < 4 || isNaN(op_priority_parent))) {
				
				if(i < S.str[0].length-1 && !isNaN(op_priority_parent) && [9,10,11].includes(op2ind(S.str[0][i+1],0)[0])) {
					S.str[0] = S.str[0].slice(0,i+1) + '*' + S.str[0].slice(i+1); // Add * after the i-th characeter.
				}
				
				i = i + di;
				break;
			}
			
			if(i >= S.str[0].length-1) {
				i = S.str[0].length-1;
				break;
			} else {
				i = i + 1;
				p1 = i;
			}
		} else if(op_type == -4) { // If it is a closing parenthesis.
			break;
		} else if(op_type == 2 || op_type == 3) { // If it's a forward operator (e.g., \frac, \sqrt, \sum), including an arbitrary function.
			
			[S,id] = add_new_substring(S,id0,id,minus);
			
			[S,undefined,i] = parse_formula(S,p1+di,[...ids, id],op_ind,op_priority,op_type,arg_list);
			[S,p1] = end_substring(S,p1,i,id,op_ind,op_type);
			
			id1 = id;
			id = id0;
			
			p1 = i;
			
			if(i == S.str[0].length-1) {
				break;
			}
		} else if(isNaN(op_type)) { // If the current character is not an operator (i.e., letter or number).
			
			[S,id] = add_new_substring(S,id0,id,minus);
			
			id1 = id;
			
			i = i + di - 1;
			
			if(i == S.str[0].length-1) { // If it's the last character.
				[S,p1] = end_substring(S,p1,i,id,op_ind,NaN);
				break;
			} else {
				if(isNaN(op_priority_parent)) { // This means that the parent of the parent operator is some kind of function.
					[S,p1] = end_substring(S,p1,i,id,op_ind,NaN);
					i = i + 1;
					p1 = i;
					break;
				} else {
					[S,p1] = end_substring(S,p1,i,id,op_ind,NaN);
				}
				
				if(isNaN(op2ind(S.str[0],i+1)[2]) || S.str[0][i+1] == '(') { // If the next element is also a letter/number (type = NaN), or if it is '('.
					S.str[0] = S.str[0].slice(0,i+1) + '*' + S.str[0].slice(i+1); // Add * after the i-th characeter.
				}
			}
			
			i = i + 1;
		} else { // Space.
			i = i + 1;
			p1 = p1 + 1;
		}
	}
	
	return [S,id,i];
}

function add_new_substring(S,id0,id,minus) {
	S.id.push(Math.max(...S.id) + 1);
	S.str.push('');
	S.parent_id.push(id0);
	S.operator.push(NaN);
	S.sign.push(minus);
	
	id = S.id.slice(-1)[0]; // Set id to the id of the last added element.
	
	return [S,id];
}

function end_substring(S,p1,i,id,operator,type) {
	i = Math.min(i,S.str[0].length-1);
	
	S.str[id] = S.str[id] + S.str[0].slice(p1,i+1);
	S.operator[id] = operator;
	if(arguments.length == 6) {
		S.type[id] = type;
	} else if(operator >= 0) { // !NaN and non-negative.
		let Ops = operators_database();
		S.type[id] = Ops.type[Ops.index.indexOf(operator)]; // get_operation_type(operator);
	} else {
		S.type[id] = NaN;
	}
	p1 = i;
	
	return [S,p1];
}