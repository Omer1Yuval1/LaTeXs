function preprocess_input(str) {
	
	var Ops = operators_database();
	var P = parameters();
	var is_good = true;
	
	var [is_good,abs_count] = check_balanaced_parentheses(str); // Check if parentheses are balanced.
	
	if(!is_good) {
		return [NaN,is_good];
	}
	
	str = abs_look_ahead(str,abs_count); // Resolve abolute value opening/closing identity.
	
	// Replace expressions to get proper notation of inverse trigonometric functions
	var A = [['\\sin^{-1}','\\arcsin'] , ['\\cos^{-1}','\\arccos'] , ['\\tan^{-1}','\\arctan'] , ['\\csc^{-1}','\\arccsc'] , ['\\sec^{-1}','\\arcsec'] , ['\\cot^{-1}','\\arccot']];
	A.forEach((element) => {
		str = str.replace(element[0],element[1]); 
	});
	
	str = str.replace('+-','-'); // Just in case user write +- in their input.
	str = str.replace(/(.{1})-/g,'$1+-'); // Add a '+' in front of every '-', unless the '-' is the first character. 
	
	str = str.replace(/([0-9a-zA-Z\)\}\]]{1})[" "]*([^a-zA-Z0-9])/g,'$1$2'); // Remove spaces between letters/numbers and other characters (non-letters and non-numbers).
	
	str = str.replace(/([^0-9a-zA-Z]{1})[" "]*([a-zA-Z0-9\(\{\[])/g,'$1$2'); // And the other way around.
	
	str = str.replace(/\\sqrt{/g,'\\sqrt[2]{'); // If a root is used without the power ([]), it means it's a square root.
	
	// Detect and standardize function composition/addition/multiplication syntax.
	var func_letters = P.function_letters.join('');
	var pattern = new RegExp("\\((["+func_letters+"])[ ]*\\\\circ[ ]+(["+func_letters+"])\\)\\(([a-z])\\)","g"); // Composition.
	str = str.replace(pattern,'$1($2($3))');
	
	var pattern = new RegExp("\\((["+func_letters+"])[ ]*([+-])[ ]*(["+func_letters+"])\\)\\(([a-z])\\)","g"); // Addition/subtraction.
	str = str.replace(pattern,'$1($4)$2$3($4)');
	
	var pattern = new RegExp("\\((["+func_letters+"])[ ]*[*]{0,1}[ ]*(["+func_letters+"])\\)\\(([a-z])\\)","g"); // Multiplication.
	str = str.replace(pattern,'$1($3)*$2($3)');
	
	var pattern = new RegExp("\\(\\\\frac\\{(["+func_letters+"])\\}\\{(["+func_letters+"])\\}\\)\\(([a-z])\\)","g"); // Division.
	str = str.replace(pattern,'\\frac{$1($3)}{$2($3)}');
	
	return [str,is_good];
}