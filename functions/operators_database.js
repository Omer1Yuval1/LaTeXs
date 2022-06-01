function operators_database() {
	
	// Types:
		// 0 = Simple middle operator (e.g., *, ^).
		// 1 = Non-simple middle operator (e.g., =, >, \\in, \\exist). These make everything before/after them their child, until the next operator of this type at this level.
		// 2 = Simple forward operator (e.g., \\frac, \\sqrt).
		// 3 = Forward opertor with non-simple inputs (e.g., \\sum, \\int, \\lim).
		// 4 = parentheses.
		// 5 = Minus and plus/minus.
	
	let i = 0;
	let priority_0 = 1;
	let Ops = {index: [], operator: [], symbol: [], type: [], argument_num: [], argument_list: [], priority: [], commutative: []};
	
	Ops['index'].push(++i);
	Ops['operator'].push('*');
	Ops['symbol'].push(String.fromCharCode(42));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 2);
	Ops['commutative'].push(true);
	
	Ops['index'].push(++i);
	Ops['operator'].push('^');
	Ops['symbol'].push(String.fromCharCode(94));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([1]);
	Ops['priority'].push(priority_0 + 1);
	Ops['commutative'].push(false);
	
	Ops['index'].push(++i);
	Ops['operator'].push('_');
	Ops['symbol'].push(String.fromCharCode(95));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	
	Ops['index'].push(++i);
	Ops['operator'].push('+');
	Ops['symbol'].push(String.fromCharCode(43));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 3);
	Ops['commutative'].push(true);
	
	Ops['index'].push(++i);
	Ops['operator'].push('=');
	Ops['symbol'].push(String.fromCharCode(61));
	Ops['type'].push(1);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0 + 4);
	Ops['commutative'].push(true);
	
	var A = [[">",62] , ["<",60] , ["≤",8804] , ["≥",8805]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(false);
	}
	
	var A = [["{",123] , ["(",40] , ["[",91]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(4);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(true);
	}
	
	var A = [["}",125] , [")",41] , ["]",93]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(-4);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(true);
	}
	
	Ops['index'].push(++i);
	Ops['operator'].push('\\sqrt');
	Ops['symbol'].push(String.fromCharCode(8730));
	Ops['type'].push(2);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([12,10]); // [']','}']
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	
	Ops['index'].push(++i);
	Ops['operator'].push('\\frac');
	Ops['symbol'].push(String.fromCharCode(247));
	Ops['type'].push(2);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([10,10]); // ['}','}'].
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	
	var A = [["\\sum",931] , ["\\int",8747]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(3);
		Ops['argument_num'].push(3);
		Ops['argument_list'].push([2,1,10]); // ['_','^','}'].
		Ops['priority'].push(priority_0 + 2);
		Ops['commutative'].push(false);
	}
	
	Ops['index'].push(++i);
	Ops['operator'].push('\\lim');
	Ops['symbol'].push('\\lim');
	Ops['type'].push(3);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([2,10]); // ['_','}']
	Ops['priority'].push(priority_0 + 2);
	Ops['commutative'].push(false);
	
	Ops['index'].push(++i);
	Ops['operator'].push('\\to');
	Ops['symbol'].push(String.fromCharCode(8594));
	Ops['type'].push(0);
	Ops['argument_num'].push(2);
	Ops['argument_list'].push([]);
	Ops['priority'].push(priority_0);
	Ops['commutative'].push(false);
	
	var A = [["\\in",8712] , ["\\notin",8713] , ["\\ni",8715] , ["\\nni",8716] , ["\\exists",8707] , ["\\nexists",8708] , ["\\subset",8834] , ["\\subseteq",8838]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(false);
	}
	
	var A = [["\\cup",8746] , ["\\cap",8745] , ["\\wedge",8896] , ["\\vee",8897]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(1);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0 + 4);
		Ops['commutative'].push(true);
	}
	
	var A = [["\\cdot",8226] , ["\\vdot",8226] , ["\\cross",215]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(0);
		Ops['argument_num'].push(2);
		Ops['argument_list'].push([]);
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(true);
	}
	
	var A = [["\\sin","sin"] , ["\\cos","cos"] , ["\\tan","tan"] , ["\\csc ","csc"] , ["\\sec","sec"] , ["\\cot","cot"] , ["\\sinh","sinh"] , ["\\cosh","cosh"] , ["\\tanh","tanh"] , ["\\coth","coth"] , ["\\arcsin","arcsin"] , ["\\arccos","arccos"] , ["\\arctan","arctan"]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(op[1]);
		Ops['type'].push(2);
		Ops['argument_num'].push(1);
		Ops['argument_list'].push([11]); // [')'].
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(false);
	}
	
	var A = [["\\nabla",8711] , ["\\gradient",8711] , ["\\grad",8711]];  // ∇. Physics. Same as \\curl, \\div.
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(2);
		Ops['argument_num'].push(1);
		Ops['argument_list'].push([10,11]); // [')','}'].
		Ops['priority'].push(priority_0);
		Ops['commutative'].push(false);
	}
	
	var A = [["-",45] , ["\\pm",177] , ["\\mp",8723]];
	for(let op of A) {
		Ops['index'].push(++i);
		Ops['operator'].push(op[0]);
		Ops['symbol'].push(String.fromCharCode(op[1]));
		Ops['type'].push(5);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(NaN);
	}
	
	greek_lower_latex = ["\\infty","\\alpha","\\beta","\\gamma","\\delta","\\epsilon","\\zeta","\\eta","\\theta","\\iota","\\kappa","\\lambda","\\mu","\\nu","\\xi","\\omicron","\\pi","\\rho","\\varsigma","\\sigma","\\tau","\\upsilon","\\phi","\\chi","\\psi","\\omega"];
	let range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i);
	let greek_lower_symbol = [8734].concat(...range(945,969));
	// ['\\Gamma','\\Delta','\\Theta','\\Lambda','\\Pi','\\Sigma','\\Upsilon','\\Phi','\\Psi','\\Omega'];
	// Uppercase: char(913:937);
	
	for(let j=0; j<greek_lower_latex.length; j++) {
		Ops['index'].push(0);
		Ops['operator'].push(greek_lower_latex[j]);
		Ops['symbol'].push(String.fromCharCode(greek_lower_symbol[j]));
		Ops['type'].push(NaN);
		Ops['argument_num'].push(NaN);
		Ops['argument_list'].push([]);
		Ops['priority'].push(NaN);
		Ops['commutative'].push(NaN);
	}
	
	return Ops;
	
}