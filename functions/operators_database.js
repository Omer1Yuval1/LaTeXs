function operators_database() {
	
	// Types:
		// 0 = Simple middle operator (e.g., *, ^).
		// 1 = Non-simple middle operator (e.g., =, >, \\in, \\exist). These make everything before/after them their child, until the next operator of this type at this level.
		// 2 = Simple forward operator (e.g., \\frac, \\sqrt).
		// 3 = Forward opertor with non-simple inputs (e.g., \\sum, \\int, \\lim).
		// 4 = parentheses.
		// 5 = Minus and plus/minus.
		// 6 = Indexing.
		// 7 = Function.
		// 8 = Identical opening and closing parentheses (not used for arguments of functions).
	
	let i = -1;
	let priority_0 = 1;
	let Ops = {index: [], operator: [], symbol: [], type: [], argument_num: [], argument_list: [], priority: [], commutative: [], text: []};
	
	Ops['index'].push(++i);
	Ops['operator'].push('*');
	Ops['symbol'].push(String.fromCharCode(42));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 2);
	Ops['commutative'].push(true);
	Ops['text'].push(["times"]);
	
	Ops['index'].push(++i);
	Ops['operator'].push('^');
	Ops['symbol'].push(String.fromCharCode(94));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([1]); // This 1 is not really used as an index (see parse_formula.js).
	Ops['priority'].push(priority_0 + 1);
	Ops['commutative'].push(false);
	Ops['text'].push(["to the power of"]);
	
	Ops['index'].push(++i);
	Ops['operator'].push('_');
	Ops['symbol'].push(String.fromCharCode(95));
	Ops['type'].push(6); // 0.
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([1]);
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	Ops['text'].push(["with index"]);
	
	Ops['index'].push(++i);
	Ops['operator'].push('+');
	Ops['symbol'].push(String.fromCharCode(43));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 3);
	Ops['commutative'].push(true);
	Ops['text'].push(["plus"]);
	
	Ops['index'].push(++i);
	Ops['operator'].push('=');
	Ops['symbol'].push(String.fromCharCode(61));
	Ops['type'].push(1);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 4);
	Ops['commutative'].push(true);
	Ops['text'].push(["equals"]);
	
	var A = [[">",62, "greater than"] , ["<",60, "less than"] , ["\\le",8804, "less than or equal to"] , ["\\ge",8805, "greater than or equal to"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["{",123, ""], ["(",40, ""], ["[",91, ""], ["\\abso", 124, "absolute value of"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(4);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(true);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["}",125, ""], [")",41, ""], ["]",93, ""], ["\\absc", 124, ""]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(-4);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(true);
		Ops['text'].push([op[2]]);
	}
	
	Ops['index'].push(++i);
	Ops['operator'].push('\\sqrt');
	Ops['symbol'].push(String.fromCharCode(8730));
	Ops['type'].push(2);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([11,9]); // [']','}']
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	Ops['text'].push(["root of"]);
	
	var A = [["\\frac",String.fromCharCode(247), "divided by"] , ["\\set",'Set', "set"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(op[1]);
		Ops['type'].push(2);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([9,9]); // ['}','}'].
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["\\ne", String.fromCharCode(8800), "not equal to"] , ["\\neq", String.fromCharCode(8800), "not equal to"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(op[1]);
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(true);
		Ops['text'].push([op[2]]);
	} // These operators are treated the same as '='.
	
	var A = [["\\sum",931, "sum"] , ["\\int",8747, "integral"] , ["\\prod",8719, "product"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(3);
		Ops['argument_num'].push(3);
		Ops['argument_list'].push([2,1,9]); // ['_','^','}'].
		Ops['priority'].push(priority_0 + 2);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2], "from", "to", "of"]);
	}
	
	var A = [["\\lim",'lim', "limit"] , ["\\inf",'inf', "infimum"] , ["\\sup",'sup', "supremum"] , ["\\min",'min', "minimum"] , ["\\max",'max', "maximum"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(op[1]);
		Ops['type'].push(3);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([2,9]); // ['_','}']
		Ops['priority'].push(priority_0 + 2);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2] + " over", "of"]);
	}
	
	Ops['index'].push(++i);
	Ops['operator'].push('\\to');
	Ops['symbol'].push(String.fromCharCode(8594));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	Ops['text'].push(["goes to"]);
	
	var A = [["\\in",8712, "in"] , ["\\notin",8713, "not in"] , ["\\ni",8715, "has the member"] , ["\\nni",8716, "???"] , ["\\exists",8707, "there exists"] , ["\\nexists",8708, "does not exist"] , ["\\subset",8834, "is a subset of"] , ["\\subseteq",8838, "is a subset of or equal to"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["\\cup",8746, "union"] , ["\\cap",8745, "intersection"] , ["\\wedge",8896, "and"] , ["\\vee",8897, "or"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(true);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["\\cdot",8226, "dot"] , ["\\vdot",8226, "dot"] , ["\\cross",215, "cross"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(0);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(true);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["\\sin","sin", "sine"] , ["\\cos","cos", "cosine"] , ["\\tan","tan", "tangent"] , ["\\csc ","csc", "cosecant"] , ["\\sec","sec", "secant"] , ["\\cot","cot", "contangent"] , ["\\sinh","sinh", "hyperbolic sine"] , ["\\cosh","cosh", "hyperbolic cosine"] , ["\\tanh","tanh", "hyperbolic tangent"] , ["\\coth","coth", "hyperbolic cotangent"] , ["\\arcsin","arcsin", "arc sin"] , ["\\arccos","arccos", "arc cos"] , ["\\arctan","arctan", "arc tan"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(op[1]);
		Ops['type'].push(2);
		Ops['argument_num'].push(1);
		Ops['argument_list'].push([10]); // [')'].
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["\\nabla",8711, "nabla"] , ["\\gradient",8711, "gradient", "gradient"] , ["\\grad",8711, "gradient"]];  // ∇. Physics. Same as \\curl, \\div.
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(2);
		Ops['argument_num'].push(1);
		Ops['argument_list'].push([null]); // [')','}'].
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2]]);
	}
	
	var A = [["-",45, "minus"] , ["\\pm",177, "plus minus"] , ["\\mp",8723, "minus plus"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(5);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(NaN);
		Ops['text'].push([op[2]]);
	}
	
	Ops['index'].push(++i);
	Ops['operator'].push(',');
	Ops['symbol'].push(String.fromCharCode(44));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 2);
	Ops['commutative'].push(true);
	Ops['text'].push(["comma"]);
	
	var A = [['\\mathbb','Number set', "numbers"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(op[1]);
		Ops['type'].push(2);
		Ops['argument_num'].push(1);
		Ops['argument_list'].push(['{']);
		Ops['priority'].push(priority_0 + 2);
		Ops['commutative'].push(false);
		Ops['text'].push([op[2]]);
	}
	
	let greek_lower_latex = ["\\infty","\\alpha","\\beta","\\gamma","\\delta","\\epsilon","\\zeta","\\eta","\\theta","\\iota","\\kappa","\\lambda","\\mu","\\nu","\\xi","\\omicron","\\pi","\\rho","\\varsigma","\\sigma","\\tau","\\upsilon","\\phi","\\chi","\\psi","\\omega"];
	let range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i);
	let greek_lower_symbol = [8734].concat(...range(945,969));
	// ['\\Gamma','\\Delta','\\Theta','\\Lambda','\\Pi','\\Sigma','\\Upsilon','\\Phi','\\Psi','\\Omega'];
	// Uppercase: char(913:937);
	
	for(let j=0; j<greek_lower_latex.length; j++) {
		Ops['index'].push(++i);
		Ops['operator'].push(greek_lower_latex[j]);
		Ops['symbol'].push(String.fromCharCode(greek_lower_symbol[j]));
		Ops['type'].push(NaN);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(NaN);
		Ops['text'].push([greek_lower_latex[j]]);
	}
	
	return Ops;
	
}