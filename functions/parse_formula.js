function parse_formula(S,p1,id0,op_ind_parent,op_priority_parent,op_type_parent,arg_list_parent) {
	
	id = id0; // id0 is the parent id. id is the index of the currently parsed element.
	id1 = id0; // id1 is the id of last parsed child element.
	minus = '';
	
	i = p1;
	while(i <= length(S(1).str)) { // For each character.
		
		[op_ind,op_priority,op_type,op_sym,di,arg_list,is_commutative] = op2ind(S(1).str,i);
		
		if(op_type_parent == 1 && op_type ~= 1 && op_type ~= -4) // If the parent is a comparison operator (=,<,> etc.), but the current one is not, and is also not a closing parenthesis.
			
			// Create a plus element under the comparison element:
			[op_ind_plus,op_priority_plus,op_type_plus] = op2ind('+',1);
			[S,id] = add_new_substring(S,id0,id,minus); % Add a new element for this operation.
			[S,p1] = end_substring(S,p1,i,id,op_ind_plus); % Once done, close the current statement (up to the previous character).
			S(id).str = '=+=';
			
			[S,id1,i] = parse_formula(S,p1,id,op_ind_plus,op_priority_plus,op_type_plus,[]); // Go one level deeper. Set the '+' operator to be the parent operator in the inner level.
			if(i == length(S(1).str))
				break;
			else
				continue;
			end
		end
		
		if(op_type == 5) // Minus and \pm. These are not treated as normal operators, but are instead attached to the element that comes after them (leaf or parenthesis).
			minus = op_sym;
			i = i + 1;
			p1 = i;
			continue;
		end
		
		if(op_type == 0 || op_type == 1) // If its a simple middle operator (e.g., *, \in).
			
			minus = '';
			
			if(op_priority < op_priority_parent || (op_priority == op_priority_parent && (op_ind ~= op_ind_parent || ~is_commutative))) // If the current operator has precedence over the parent operator (e.g., * < +).
				
				p1 = p1 + di; // Start the next element after the char+operator (TODO: this needs to be generalized for 2+ leafs).
				
				[S,id] = add_new_substring(S,id0,[],minus); // Add a new element for this operation.
				
				if(op_type_parent ~= 3) // Feedback mechanism for middle operations.
					
					if(op_type == 1) // If the parent is a comparison operator (=,<,> etc.).
						id_temp = find([S.parent_id] == find([S.type] == 1,1,'last') & [S.operator] > 0,1,'last'); // Find the last child of the last comparison operator.
						S(id).parent_id = S(id_temp).parent_id;
						S(id_temp).parent_id = id; // Make the new comparison element its parent.
						
						% Create a plus element under the comparison element:
						[op_ind_plus,op_priority_plus,op_type_plus] = op2ind('+',1);
						[S,id1] = add_new_substring(S,id,[],minus); % Add a new element for this operation.
						[S,p1] = end_substring(S,p1,i,id1,op_ind_plus); // Once done, close the current statement (up to the previous character).
						S(id1).str = '=+=';
						
						[S,id1,i] = parse_formula(S,p1+di,id1,op_ind_plus,op_priority_plus,op_type_plus,[]); // Go one level deeper. Set the '+' operator to be the parent operator in the inner level.
						
						[S,p1] = end_substring(S,p1,i-1,id,op_ind);
						S(id).str = op_sym;
						
						if(i == length(S(1).str))
							i = i + 1;
						end
						p1 = i;
						continue;
					else
						S(id1).parent_id = id; // Make this new element the parent of the last closed element.
						S(id).str = [S(id1).str,op_sym]; // For the new element, add the str of the last closed element (before the operation) as an initial str (the rest will be added later).
					end
				else // If the parent is a type 3 operator (e.g., \sum, \int, \lim).
					op_priority = nan;
				end
				
				[S,id1,i] = parse_formula(S,i+di,id,op_ind,op_priority,op_type,arg_list); // Go one level deeper. Send the current operator as the parent operator for the deeper leve.
				[S,p1] = end_substring(S,p1,i-1,id,op_ind); // Once done, close the current statement (up to the previous character).
				
				if(i < length(S(1).str))
					%
					if(op_type_parent == 3) // If the parent is a type 3 operator (e.g., \sum, \int, \lim).
						[~,I] = ismember(op_ind,arg_list_parent);
						if(I)
							arg_list_parent(I) = []; // Remove the operator from the parent's arg_list.
						end
					end
					%}
					id1 = id;
					p1 = i;
					continue;
				else
					break;
				end
			elseif(op_priority_parent < op_priority || isnan(op_priority_parent)) // If the parent operator has precedence over the current operator (e.g., + > *).
				if(isnan(S(id).operator))
					[S,p1] = end_substring(S,p1,i-1,id,op_ind); // Close the last statement. Return the previous char as last (operator not included).
				end
				id = id1; // This is done to return the latest id to the first outer level.
				break; // Break to go back one level up.
			elseif(op_ind == op_ind_parent) // If the current and parent operators are identical and commutative.
				if(isnan(S(id1).operator))
					[S,p1] = end_substring(S,p1,i-1,id1,op_ind);
				end
				i = i + 1;
				p1 = i;
				continue; // Simply continue creating new elemets at the same level, under the same parent.
			else // Same priority, different operator (or leaf).
				id1 = id;
				p1 = i;
				continue;
			end
		elseif(op_type == 4) // If it is an opening parenthesis.
			
			[S,id] = add_new_substring(S,id0,id,minus); % If there is no operator before the open parenthesis.
			
			% [op_ind_plus,op_priority_plus,op_type_plus] = op2ind('+',1);
			[op_ind_plus,op_priority_plus,op_type_plus] = op2ind('=',1);
			
			[S,id1,i] = parse_formula(S,p1+1,id,op_ind_plus,op_priority_plus,op_type_plus,[]); // Go one level deeper. Set the '+' operator to be the parent operator in the inner level.
			i = min(i,length(S(1).str));
			
			[S,p1] = end_substring(S,p1,i,id,op2ind(op_sym,1)); // Once done, close the current statement (up to the previous character).
			
			id1 = id;
			
			% Check the status of the arguments of the parent operator:
			if(length(arg_list_parent) == 1 || ismember(op_ind,arg_list_parent))
				arg_list_parent(:,1) = []; % Remove the first index that matched the current closing parenthesis.
				if(isempty(arg_list_parent))
					
					if(i < length(S(1).str) && ~isnan(op_priority_parent) && ismember(op2ind(S(1).str(i+1),1),[10,11,12]))
						S(1).str = [S(1).str(1:i),'*',S(1).str(i+1:end)];
					end
					
					i = min(i + 1,length(S(1).str));
					break; % If the arguments list is now empty, break back to the level of the latex operator.
				end
			elseif(op_type_parent == 0 && (op_priority_parent < 4 || isnan(op_priority_parent)))
				
				if(i < length(S(1).str) && ~isnan(op_priority_parent) && ismember(op2ind(S(1).str(i+1),1),[10,11,12]))
					S(1).str = [S(1).str(1:i),'*',S(1).str(i+1:end)];
				end
				
				i = i + 1;
				break;
			end
			
			if(i >= length(S(1).str))
				i = length(S(1).str);
				break;
			else
				i = i + 1;
				p1 = i;
			end
		elseif(op_type == -4) // If it is a closing parenthesis.
			break;
		elseif(op_type == 2 || op_type == 3) // If it's a forward operator (e.g., \frac, \sqrt, \sum).
			
			[S,id] = add_new_substring(S,id0,id,minus);
			[S,id1,i] = parse_formula(S,p1+di,id,op_ind,op_priority,op_type,arg_list);
			[S,p1] = end_substring(S,p1,i,id,op_ind);
			
			id1 = id;
			id = id0;
			p1 = i;
			
			if(i == length(S(1).str))
				break;
			end
		elseif(isnan(op_type)) // If the current character is not an operator (i.e., letter or number).
			% elseif(op_ind == 0) // If the current character is not an operator (i.e., letter or number).
			[S,id] = add_new_substring(S,id0,id,minus);
			id1 = id;
			
			i = i + di - 1;
			
			if(i == length(S(1).str)) // If it's the last character.
				[S,p1] = end_substring(S,p1,i,id,op_ind);
				break;
			elseif(isnan(op_priority_parent))
				[S,p1] = end_substring(S,p1,i,id,op_ind);
				i = i + 1;
				p1 = i;
				break;
			else
				[S,p1] = end_substring(S,p1,i,id,op_ind);
				id1 = id;
			end
			
			i = i + 1;
		else // Space.
			i = i + 1;
			p1 = p1 + 1;
		end
		
	}
	
	return [S,id,i];
}


// Note that in the MATLAB version these functions are inside the above function.

function add_new_substring(S,id0,id,minus) {
	S(end+1).id = max([S.id]) + 1;
	S(end).parent_id = id0;
	S(end).operator = nan;
	S(end).sign = minus;
	
	id = S(end).id;
	
	return [S,id];
}

function end_substring(S,p1,i,id,operator) {
	i = min(i,length(S(1).str));
	
	S(id).str = [S(id).str,S(1).str(p1:i)];
	S(id).operator = operator;
	if(~isnan(operator))
		S(id).type = get_operation_type(operator);
	else
		S(id).type = nan;
	end
	p1 = i;
	
	return [S,p1];
}