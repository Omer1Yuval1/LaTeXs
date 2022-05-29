function sort_tree(S,p,sub_id) {
	
	// TODO: seems like this algorithm goes over each element multiple times.
	
	// This algorithm sorts a given tree (directed graph) in a top-down manner.
	// For each level, it first considers level-specific features (such as operator and leaf type).
	// Then, as a secondary sorting condition, it sorts by tree size.
	// Tree size is an array containing the number of elements within each level of a sub-tree (see get_tree_size.m for more information).
	// In addition, every elemets are assigned with sub-id, corresponding to their order as direct children of a parent element.
	
	var P = parameters();
	var Ops = operators_database();
	
	if(nargin < 3) {
		var sub_id = 0;
	}
	
	var F0 = find([S.id] == p); // Find element p (id=p).
	var F1 = find([S.parent_id] == p); // Find all direct children of parent p.
	
	// Sort by operation type
	if(~isempty(F0) && length(F1) > 1 && Ops(find([Ops.index] == S(F0).operator)).commutative) { // If the parent operator is commutative and has more than one child.
		
		[~,ops_loc] = ismember([S(F1).operator],[Ops.index]); // Get the row numbers in the operators struct of all operators with parent p.
		
		// If it's a leaf, put numbers first, then letters, then all other non-leaf elements
		numeric_value = nan(size(ops_loc)); // This is used as a third condition to order numbers accordings to their size.
		for j=1:length(ops_loc) { // For each element.
			if(ops_loc(j) == 0) { // If it's a leaf
				if(isletter(S(F1(j)).str(1)) || S(F1(j)).str(1) == '\\') { // If it's a letter.
					ops_loc(j) = P.Letter_Index; // Letters come before operators.
				} else {
					ops_loc(j) = P.Number_Index; // Numbers come before letters.
					numeric_value(j) = str2num(S(F1(j)).str);
				}
			} else { // If it's an operator.
				ops_loc(j) = Ops(ops_loc(j)).index; // Use the index (unique) for sorting. 
			}
		}
		
		// For identical elements, sort by tree size (first by number of levels, then by number of elements in each level, going top-down).
		for i=1:length(F1) { // Get the tree size array for each child.
			size_array{i} = transpose(get_tree_size(S,S(F1(i)).id));
		}
		Lmax = max(cellfun(@length,size_array)); // Maximum number of levels across all children at this level.
		size_array = cell2mat(cellfun(@(x) [x;zeros(Lmax-length(x),1)],size_array,'UniformOutput',false)); // Add zeros so that all cells have the same number of elements. Then convert to a matrix where each column is a different element (F1(i)), and each row is a different level.
		
		all_weights = transpose([ops_loc ; size_array ; numeric_value]); // First column considers same level features (ops_loc). The rest of the columns contain tree-size information. Row correspond to elements, and columns correspond to levels (highest level first).
		[undefined,I] = sortrows(all_weights,1:size(all_weights,2)); // Get the indices for sorting the elements. Sort first by same level features (operation/leaf type), and then by tree size.
		
		var F1_sorted = F1(I);
		var New_Ids = sort([S(F1_sorted).id]);
		
		for j=1:length(F1) { // Temporarily make the ids of all sorted elements negative.
			for k=find([S.parent_id] == S(F1(j)).id) { // First add the negative sign to the parent ids of its children.
				S(k).parent_id = -S(k).parent_id;
			}
			S(F1(j)).id = -S(F1(j)).id; // Then add the negative sign to id of the element itself.
		}
		
		for j=1:length(F1_sorted) {// Then assign the new ids after sorting.
			for k=find([S.parent_id] == S(F1_sorted(j)).id) { // First update the children (use the old id (with a minus) to find them).
				S(k).parent_id = New_Ids(j);
			}
			S(F1_sorted(j)).id = New_Ids(j); // Then update the id of the element.
			// S(F1_sorted(j)).sub_id = j; // Also assign sub_id, using the new order of the elements.
			// S(F1_sorted(j)).parent_sub_id = S(F0).sub_id; // Also assign sub_id, using the new order of the elements.
			sub_id = sub_id + 1;
			S(F1_sorted(j)).sub_id = sub_id;
		}
		
		F1 = F1_sorted; // This is done so that the recursive for-loop at the bottom goes over elements in their sorted order.
	} else {
		for i=1:length(F1) {
			sub_id = sub_id + 1;
			S(F1(i)).sub_id = sub_id; % Assign sub_id.
			// S(F1(i)).sub_id = i; % Assign sub_id.
			// S(F1(i)).parent_sub_id = i; % Assign sub_id.
		}
	}
	
	for i=1:length(F1) {
		[S,sub_id] = sort_tree(S,F1(i),sub_id);
	}
	
	return [S,sub_id];
	
}