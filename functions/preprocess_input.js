function preprocess_input(str) {
	
	var Ops = operators_database();
	var is_good = true;
	
	// Replace expressions to get proper notation of inverse trigonometric functions
	var A = [['\\sin^{-1}','\\arcsin'] , ['\\cos^{-1}','\\arccos'] , ['\\tan^{-1}','\\arctan'] , ['\\csc^{-1}','\\arccsc'] , ['\\sec^{-1}','\\arcsec'] , ['\\cot^{-1}','\\arccot']];
	A.forEach((element) => {
		str = str.replace(element[0],element[1]); 
	});
	
	// TODO: This can probably be written more compactly.
	str = str.replace('+-','-'); // Just in case user write +- in their input.
	
	str = str.replace(/(.{1})-/g,'$1+-'); // Add a '+' in front of every '-', unless the '-' is the first character. 
	
	str = str.replace(/([0-9a-zA-Z\)\}\]]{1})[" "]*([^a-zA-Z0-9])/g,'$1$2'); // Remove spaces between letters/numbers and other characters (non-letters and non-numbers).
	
	str = str.replace(/([^0-9a-zA-Z]{1})[" "]*([a-zA-Z0-9\(\{\[])/g,'$1$2'); // And the other way around.
	
	str = str.replace(/\\sqrt{/g,'\\sqrt[2]{'); // If a root is used without the power ([]), it means it's a square root.
	
	var [is_good,abs_count] = check_balanaced_parentheses(str); // Check if parentheses are balanced.
	
	str = abs_look_ahead(str,abs_count);
	
	return [str,is_good];
}