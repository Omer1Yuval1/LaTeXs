function [C0,C1] = get_trees_similarity(S0,S1,vars,params,param_constraints)
	
	// TODO:
		// Add a cell array of variable. change the last argument to param_constraints.
	
	// This function computes a similarity score between two given trees.
	// The similarity is computed asymmetrically, as one tree (S0) is the reference tree, and the second (S1) is the tested tree.
	
	// Run examples
	/*
		S0 = index(34,0);
		S1 = index(35,0);
		[C0,C1] = get_trees_similarity(S0,S1);
		
		[C0,C1] = get_trees_similarity('a*x^2','3*x^2');
		
		[C0,C1] = get_trees_similarity('x^2+bx+c','y^2+5y+6',{'x'},{'b','c'});
		[C0,C1] = get_trees_similarity('x^2+bx+b','x^2+5x+6',{'b'}); // Different values for the same parameter.
	*/
	
	// Thoughts:
		// I'm pretty sure that the nested structure can be linealized.
			// Assign every set of direct children indices from 1 to n (after sorting).
			// Then create an array with 3 columns: id,parent_id,level.
			// Then sort this array using all columns. Then compare arrays.
		// The nested structure might make it easier to apply shifts when comparing. How would this be done in the linealized representation?
	// TODO
		// Try to perform the comparison using the same recursive function.
			// Try to also find the param-number matching at the same time.
		// A newer idea
			// Use a cell array with nested array.
				// This way I will not have to create empty cells (as opposed to matrix that has to be rectangular).
			// Two comparison modes
				// Similarity.
				// Matching of a specific problem to a generalized problem.
					// Only match nodes and numbers in the target.
					// Find the matching between source numbers and target parameters.
					// Test case: ax^2 + bx + c.
		// A new idea:
			// Each level is a dimension.
			// Create a multi-D array where each level has its own dimention.
			// This way, the number of children (including non-direct children) elements does not affect the relative position of parent elements at the same level.
			// Then, these matrices can be compared by dot product (for structure comaprison only), or by == to also check if operators at the same position are identical.
		// Rewrite this algorithm. The ids and parent ids are different in different trees (even if trees are identical).
			// Simply go down the hierarchy and compare elements. This will also enable to match sub-trees.
			// This can be done recursively, very similar to the sorting algorithm (only that here we already have the order).
			// Alternatively, I could go over each level, and assign new temporary ids in the same order of the original ids.
				// Checked this. ids across elements in a certain level are also not sorted. The sorting in the plot is obtained by their parents.
				// So really the only way is probably to go both horizontally (right) and down the hierarchy.
				// I could map each tree's hierarchy and assign sub-ids, and then build the mat0 and mat1.
		// If an element is not found, I consider its distance NaN. But actually it should probably be the largest penalty.
		// Normalise each level by divding by the number of elements (more elements means more chances for match).
			// Think of normalising for the total number of ref elements for comparing scores across ref formulas.
				// But I think that dividing by the number of element in each level already accounts for this.
	
	if(ischar(S0) && ischar(S1))
		S0 = index(S0,0,0);
		S1 = index(S1,0,0);
	end
	
	// Create nested cell arrays for the reference and input trees
	C0 = generate_nested_array(S0,{},null);
	C1 = generate_nested_array(S1,{},null);
	C0 = C0{1};
	C1 = C1{1};
	
	// Compare the nested arrays of the reference (C0) and input (C1) trees
	[op_score,leaf_score] = compare_nested_arrays(C0,C1,0,0);
	disp([op_score,leaf_score]);
	
	if(nargin >= 3 && op_score == 0) // If parameters are given as an input argument && if the structures are identical.
		vars_vals = cell(1,length(vars));
		param_vals = cell(1,length(params));
		[vars_vals,param_vals] = match_values(C0,C1,vars,vars_vals,params,param_vals);
		disp('Variables: ');
		disp(join([vars',vars_vals'],'=')');
		disp('Parameters: ');
		disp(join([params',param_vals'],'=')');
	end
	
	function C = generate_nested_array(S,C,p0)
		
		Fp = find([S.parent_id] == p0); // Find all direct children of the parent id.
		[~,I] = sort([S(Fp).id]); // Get the *order* of the indices in ascending order.
		
		for i=1:length(I) // For each child element of parent p0 (with indices in ascending order (according to tree sorting)).
			
			if(S(Fp(I(i))).operator == 0) // If it's a leaf.
				C{end+1} = S(Fp(I(i))).str; // Add the i-th child's str (param/number).
				// C{end+1} = S(Fp(I(i))).id; // Add the i-th child id  (only used for testing).
			else
				C{end+1} = {S(Fp(I(i))).operator}; // Add the i-th child operator.
				// C{end+1} = {S(Fp(I(i))).id}; // Add the i-th child id (only used for testing).
				C{end} = generate_nested_array(S,C{end},S(Fp(I(i))).id); // Repeat the process recursively for the i-th element's subtree.
			end
		end
	end
	
	function [op_score,leaf_score] = compare_nested_arrays(C0,C1,op_score,leaf_score)
		for i=1:min(length(C0),length(C1)) // For each pair of corresponding cells of C0 and C1 in the current level (the first element in each level is the parent).
			if(length(C0{i}) == 1 && length(C1{i}) == 1) // If both arrays have a single element in the i-th cell (and can thus be compared).
				if(isnumeric(C0{i}) && isnumeric(C1{i})) // If both are not leafs.
					if(C0{i} ~= C1{i})
						op_score = op_score + 1;
					end
				elseif(ischar(C0{i}) && ischar(C1{i})) // If both are leafs.
					if(C0{i} ~= C1{i})
						leaf_score = leaf_score + 1;
					end
				else // One is a leaf and one is not.
					op_score = op_score + 1;
					leaf_score = leaf_score + 1;
				end
			elseif(length(C0{i}) > 1 && length(C1{i}) > 1) // If both arrays have multiple elements in the i-th cell.
				[op_score,leaf_score] = compare_nested_arrays(C0{i},C1{i},op_score,leaf_score);
			else // If one array have a single element and the other multiple elements in the i-th cell.
				// Compare only the first element.
			end
		end
	end
	
	function [vars_vals,param_vals] = match_values(C0,C1,vars,vars_vals,params,param_vals)
		
		for i=1:length(C0) // For each pair of corresponding cells of C0 and C1 in the current level (the first element in each level is the parent).
			if(ischar(C0{i}) && ischar(C1{i})) // If both are leafs.
				
				[~,Iv] = ismember(C0{i},vars);
				[~,Ip] = ismember(C0{i},params);
				
				if(Iv) // If this character is a variable (i.e., not a parameters or a number).
					if(~isempty(vars_vals{Iv}) && vars_vals{Iv} ~= C1{i}) // If a value for this parameter already exists && this value is different from the current value.
						vars_vals{Iv} = nan;
					else
						vars_vals{Iv} = C1{i}; // Add its value to the vars_vals array at the same index as the matching parameter.
					end
				elseif(Ip) // If this character is a parameters (i.e., not a variable or a number).
					if(~isempty(param_vals{Ip}) && param_vals{Ip} ~= C1{i}) // If a value for this parameter already exists && this value is different from the current value.
						param_vals{Ip} = nan;
					else
						param_vals{Ip} = C1{i}; // Add its value to the param_vals array at the same index as the matching parameter.
					end
				end
			elseif(length(C0{i}) > 1)
				[vars_vals,param_vals] = match_values(C0{i},C1{i},vars,vars_vals,params,param_vals);
			end // else - continue. Do nothing about non-leaf elements.
		end
	end
	
end