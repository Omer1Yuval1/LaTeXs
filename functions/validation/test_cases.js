function test_cases(n) {
	
	var str = [];
	var i = -1;
	
	// Simple cases
	str[++i] = 'x + y + z';
	str[++i] = '2xy + zw';
	str[++i] = 'x^2';
	str[++i] = '3*x^2';
	str[++i] = 'z*x*y';
	
	// Indices
	str[++i] = '2x_3 + 4';
	str[++i] = '2x_3 + x*y*z';
	str[++i] = 'b5xa + 2x_3 + y*a*h + w';
	
	// Minus sign
	str[++i] = 'x * y - z';
	str[++i] = '2x - x*y*z';
	str[++i] = 'x*y*z + 2x^3';
	str[++i] = '2x_3 - x*y*z';
	str[++i] = '-y*z + w'; // Minus as first character.
	
	// Parentheses
	str[++i] = '(y+z)*x';
	str[++i] = 'x + (y*z)';
	str[++i] = 'x * (y + z + w)';
	str[++i] = '(y*z + w)';
	str[++i] = '(y + z*w)';
	str[++i] = 'x + (y*z + w)';
	str[++i] = 'x + (w + y*z)';
	str[++i] = 'x + (w^2 + y*z)';
	
	// Parentheses and minus sign
	str[++i] = 'x + (y*z^2 - w)';
	str[++i] = 'x - (y+z)';
	str[++i] = 'x^(y+z)'; // This is wrong syntax in LaTeX. Should be 'x^{y+z}'.
	str[++i] = 'x^{y+z}';
	
	// Parentheses and power
	str[++i] = '1 + (x*y)^2';
	
	// LaTeX commands
	str[++i] = '\frac{x}{y}*b';
	str[++i] = '\frac{x+2*w}{y^3}';
	str[++i] = '\sqrt{x}';
	str[++i] = '\sqrt[4]{x}';
	
	// Multi-digit numbers and decimals
	str[++i] = 'x + 32.4';
	str[++i] = 'x^23';
	str[++i] = 'x^2*3';
	str[++i] = '\frac{y^x}{x+b} + z^{\sqrt[3]{y}}';
	str[++i] = 'z^{\sqrt[3]{w}} + \frac{w^r}{r+m}';
	
	// Middle and forward operations
	str[++i] = 'a \in b';
	str[++i] = '{a^3} \in {b^2} + c';
	str[++i] = '{a^3} \in \frac{1}{2}';
	
	// Combination of index and power operators
	str[++i] = 'a_b^c';
	str[++i] = 'a^b_c';
	
	// Sorting of numbers according to their numeric value
	str[++i] = 'z + 3 + y + 1 + x + 2';
	
	// Summation, integration and limits
	str[++i] = '\sum_{i+1}^{N+1}{i^2}';
	str[++i] = '\int_{i+1}^{N+1}{i^2}';
	str[++i] = '\sum_i^N';
	str[++i] = '\sum_i^N {2}';
	str[++i] = '\lim_{i \to \infty} {1}';
	str[++i] = 'a_{i+1}{2}';
	
	// Comparisons
	str[++i] = 'x^2 + y = w + z^3';
	str[++i] = 'x + 2 = y = z';
	str[++i] = '2 + x^2 > y + 2';
	str[++i] = 'x > y < z';
	str[++i] = 'x > y';
	
	// Trigonometric functions
	str[++i] = '\tan(x)(y)'; // A * sign is added during parsing.
	str[++i] = '\sin^{-1}(x+6)'; // Inverse sine function is replaced by arcsin.
	
	// Comparison inside parentheses
	str[++i] = '\sum_{i=0}^{N}{1}';
	str[++i] = '\cos(x=0)';
	
	// Unnecessary arguments
	str[++i] = '\frac{x}{y}{b}';
	str[++i] = '\sqrt[3]{x}{y}{b}';
	str[++i] = '\nabla(x+4)(5)';
	str[++i] = '\lim_{i \to \infty} {1}{x}';
	
	
	if(arguments.length == 1) {
		str = str[n];
	}
	
	return str;
}