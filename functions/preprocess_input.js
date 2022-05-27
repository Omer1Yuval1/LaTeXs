function preprocess_input(str) {
	
	Ops = operators_database();
	
	// Replace wrong notation of inverse trigonometric functions
	A = {'\sin^{-1}','\arcsin' ; '\cos^{-1}','\arccos' ; '\tan^{-1}','\arctan' ; '\csc^{-1}','\arccsc' ; '\sec^{-1}','\arcsec' ; '\cot^{-1}','\arccot'};
	for j=1:size(A,1) {
		str = strrep(str,A{j,1},A{j,2}); 
	}
	
	// Temporarily remove Latex tags (in order to add * between letters):
	s0 = nan;
	A = {}; // Middle operations.
	B = {}; // Forward operations.
	[s0,s1] = regexp(str,'\\[a-zA-Z]+','once'); // Find the next LaTex tag.
	while(~isempty(s0)) {
		
		op_type = Ops(find([Ops.operator] == str(s0:s1))).type; // 0 = middle operator. 1 = forward operator.
		if(op_type == 0 || op_type == 1) { // Middle operation.
			A{end+1} = str(s0+1:s1);
			str = replaceBetween(str,s0+1,s1,'@');
		} else if(op_type == 2 || op_type == 3 || isnan(op_type)) { // Forward operation OR a special character.
			B{end+1} = str(s0+1:s1);
			str = replaceBetween(str,s0+1,s1,'#');
		}
		
		[s0,s1] = regexp(str,'\\[a-zA-Z]+','once'); // Find the next LaTex tag.
	}
	
	// TODO: This can probably be written more compactly.
	str = strrep(str,'+-','-');
	str = regexprep(str,'(.{1})-','$1+-'); // Add a '+' in front of every '-', unless the '-' is the first character. 
	
	str = regexprep(str,'([0-9a-zA-Z]{1})[" "]*([a-zA-Z\(\[]{1})','$1*$2'); // Add * between numbers/letters, letters/letters, numbers/parenthesis and letters/parenthesis. Any spaces in between are removed.
	str = regexprep(str,'([0-9a-zA-Z]{1})[" "]*([a-zA-Z\(\[]{1})','$1*$2'); // Repeat.
	str = regexprep(str,'([a-zA-Z\)]{1})[" "]*([0-9]{1})','$1*$2'); // Add * between letters/numbers. Any spaces in between are removed.
	
	str = regexprep(str,'([0-9a-zA-Z\)]{1})[" "]*(\\#)','$1*$2'); // Add * between letters/numbers and latex operators. Any spaces in between are removed.
	
	// Put back forward Latex operators:
	s0 = nan;
	ii = 0;
	[s0,s1] = regexp(str,'\\#','once'); // Find the first LaTex tag (forward operations only).
	while(~isempty(s0)) {
		ii = ii + 1;
		str = replaceBetween(str,s0+1,s1,B{ii}); // Just put back the operation as is.
		[s0,s1] = regexp(str,'\\#','once'); // Find the next LaTex tag  (forward operations only).
	}
	
	// Put back middle Latex operators:
	s0 = nan;
	ii = 0;
	[s0,s1] = regexp(str,'\\@','once'); // Find the first LaTex tag (forward operations only).
	while(~isempty(s0)) {
		ii = ii + 1;
		str = replaceBetween(str,s0+1,s1,A{ii}); // Just put back the operation as is.
		[s0,s1] = regexp(str,'\\@','once'); // Find the next LaTex tag  (forward operations only).
	}
	
	str = regexprep(str,'([\)\}\]]{1})[" "]*([0-9a-zA-Z]{1})','$1*$2'); // Add * after any closing parenthesis followed by a number or letter.
	
	str = regexprep(str,'([0-9a-zA-Z\)\}\]]{1})[" "]*([^a-zA-Z0-9])','$1$2'); // Remove spaces between letters/numbers and other characters (non-letters and non-numbers).
	str = regexprep(str,'([^0-9a-zA-Z]{1})[" "]*([a-zA-Z0-9\(\{\[])','$1$2'); // And the other way around.
	
	str = regexprep(str,'\\sqrt{','\\sqrt[2]{'); // If a root is used without the power ([]), it means it's a square root.
	
	return str;
}