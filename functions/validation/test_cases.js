function test_cases(n) {
	
	var str = [];
	var i = -1;
	
	// Simple cases
	str[++i] = ['x+a', '1+y'];
	str[++i] = ['ax^2 - bx + c', '2x^2 - 5x + 3'];
	str[++i] = ['2xy^3 + z_1w', 'z_1w + 2xy^3'];
	
	// Parentheses
	str[++i] = ['x + (w^2 + y*z)', 'x * (y*z + w^2)'];
	
	// Parentheses and minus sign
	str[++i] = ['x^{(y+z)}', 'x^{-(y+z)}'];
	
	// Parentheses and power
	str[++i] = ['1 + (x*y)^2', '1 + (x*y)^2'];
	
	// LaTeX commands
	str[++i] = ['\\frac{x+2*w}{y^3}', '\\frac{2*w+x}{y^3}'];
	str[++i] = ['\\sqrt{x}', '\\sqrt[2]{x}'];
	
	// Multi-digit numbers and decimals
	str[++i] = ['x + a', 'x + 32.4'];
	str[++i] = ['x^23', 'x^2*3'];
	
	// Middle and forward operations
	str[++i] = ['a \\in b', '{a^3} \\in {b^2} + c'];
	
	// Combination of index and power operators
	str[++i] = ['a_b^c', 'a^b_c'];
	
	// Sorting of numbers according to their numeric value
	str[++i] = ['z + 3 + y + 1 + x + 2', 'y + 2 + y + 3 + z + 1'];
	
	// Summation, integration and limits
	str[++i] = ['\\sum_i^N (x)', '\\sum_{i=1}^{N+1}{i^2}'];
	// str[++i] = '\\int_{i+1}^{N+1}{i^2}';
	// str[++i] = '\\sum_i^N {2}';
	str[++i] = ['\\int_{i=1}^{N+1}{i^2}', '\\lim_{i \\to \\infty} i^2'];
	// str[++i] = 'a_{i+1}{2}';
	str[++i] = ['\\min_{x \\in [a,b]} f(x)', '\\sup_{x \\in \\mathbb{R}} f(x)'];
	
	// Comparisons
	str[++i] = ['x^2 + y = w + z^3', 'x + 2 = y = z'];
	// str[++i] = 'x + 2 = y = z';
	str[++i] = ['x > y < z', '2 + x^2 > y + 2'];
	// str[++i] = 'x > y < z';
	// str[++i] = 'x > y';
	
	// Trigonometric functions
	str[++i] = ['\\tan(x)(y)', '\\sin^{-1}(x+6)']; // A * sign is added during parsing. Inverse sine function is replaced by arcsin.
	// str[++i] = '\\sin^{-1}(x+6)'; // Inverse sine function is replaced by arcsin.
	
	// Comparison inside parentheses
	// str[++i] = '\\sum_{i=0}^{N} xy^i';
	// str[++i] = '\\cos(5x < 0)';
	
	// Unnecessary arguments
	// str[++i] = '\\frac{x}{y}{b}';
	// str[++i] = '\\sqrt[3]{x}{y}{b}';
	// str[++i] = '\\nabla(x+4)(5)';
	// str[++i] = '\\nabla{x+4}(5)';
	// str[++i] = '\\lim_{i \\to \\infty} x^{-i}';
	
	// Indexing & arguments pathologies
	str[++i] = ['(x=1)_n', '\\prod_{i=0}^N \\sum_{j=0}^N \\sum_{k=0}^N (i*j*k)'];
	
	// variables vs functions
	// str[++i] = 'f_n^2';
	// str[++i] = 'f_n^2 (x)';
	// str[++i] = 'f_{n}^{2} (x) + y + z + \\sum(w)';
	str[++i] = ['f(x,y,z)','G(z,y,x)'];
	str[++i] = ['n(k+1)','f(x+1)'];
	// str[++i] = 'f(x+1)';
	// str[++i] = 'f^{{k}}(x) + f(x)*g(x)';
	
	// Absolute value
	str[++i] = ['|x + |a||', '|x + |2||'];
	
	// function composition
	str[++i] = ['(f \\circ g)(x)', '(f \\circ g)(x)'];
	str[++i] = ['(f+g)(x)', '(\\frac{f}{g})(x)'];
	str[++i] = ['\\sum_{i=1}^{N+1}{\\frac{(f \\circ g)(x)}{\\lim_{i \\to \\infty} \\sqrt[3]{i}}}', '\\sum_{i=1}^{N+1}\\frac{(f \\circ g)(x)}{\\lim_{i \\to \\infty} \\sqrt[3]{i}}'];
	
	// Set notation
	str[++i] = ['\\{ x \\in \\mathbb{Z} | -4 \\le x < 3 \\}', '\\{ x \\in \\mathbb{Z} | -4 \\le x < 3 \\}'];
	
	if(arguments.length == 1) {
		str = str[n];
	}
	
	return str;
}