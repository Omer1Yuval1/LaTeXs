function simplify_tree()
	// TODO:
		// {} is actually {=}. If removed, they sometimes need to be replaced by =.
			// If they have 2 direct children, then it must be an equation/comparison.
		// Remove elements (nodes) with a single child and connect their child and parent (I think that's wrong and too general).
			// Parenthesis as a single child of a +.
		// Associativity: x*(y*z) = x*y*z.
		// Check test case 58 (a * is a child of a *).
		// Any parenthesis with a single child.
			// Then if an associative && commutative operator has the same operator as a child, merge them into one group under the parent (remove the child operator).
				// Example: 'x*(y*z)'.
			// I might want to avoid changing such things.
		// Possibly merge labels of merged nodes.
		// I need to keep parentheses that belong to latex operations. Probably can just keep all {} and [].
end