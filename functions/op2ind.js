function [ind,priority,type,sym,di,arg_list,is_commutative] = op2ind(str,i)
	
	// This function gets an operator as a string (this can be either a single character or a LaTex command).
	// It returns the unique index (int) of the operation (ind), as well as its symbol (sym).
	
	P = parameters();
	Ops = operators_database();
	
	// Set the default to be a middle operator with two arguments (one before and one after):
	type = 0;
	arg_list = nan;
	priority = nan;
	is_commutative = nan;
	
	if(str[i] == '\\') // Find the operator in the operators database.
		[s,t] = regexp(str(i:end),'^(\\[a-z]+)','once');
		fop = find([Ops.operator] == str(i:(i+t-1)));
		di = strlength(Ops(fop).operator);
		sym = Ops(fop).symbol;
		ind = Ops(fop).index; // find(P.Operation_Order_Parsing == sym,1);
		type = Ops(fop).type;
		arg_num = Ops(fop).argument_num;
		arg_list = Ops(fop).argument_list;
		priority = Ops(fop).priority;
		is_commutative = Ops(fop).commutative;
	// elseif(ismember(str(i),P.Operation_Order_Parsing)) // If it's a single character operator.
	elseif(ismember(str(i),[Ops.operator])) // If it's a single character operator.
		
		sym = str(i);
		di = 1;
		
		fop = find([Ops.operator] == str(i));
		ind = Ops(fop).index;
		priority = Ops(fop).priority; // ind = find(P.Operation_Order_Parsing == str(i),1);
		type = Ops(fop).type;
		arg_num = Ops(fop).argument_num;
		arg_list = Ops(fop).argument_list;
		is_commutative = Ops(fop).commutative;
		
	elseif(~isempty(regexp(str(i:end),'^[0-9]+[.]{1}[0-9]+','once'))) // A decimal number (must come before the next condition for matching an integer).
		[a,b] = regexp(str(i:end),'^[0-9]+[.]{1}[0-9]+','once');
		ind = 0;
		type = nan;
		di = b-a+1;
		sym = str(a:b);
	elseif(~isempty(regexp(str(i:end),'^[0-9]+','once'))) // An integer number.
		[a,b] = regexp(str(i:end),'^[0-9]+','once');
		ind = 0;
		type = nan;
		di = b-a+1;
		sym = str(a:b);
	elseif(~isempty(regexp(str(i:end),'^[a-zA-Z]{1}','once'))) // A letter.
		% regexp(str(i:end),'^[a-zA-Z]{1}','once');
		ind = 0;
		type = nan;
		di = 1;
		sym = str(i);
	else // Space.
		ind = nan;
		di = 1;
		sym = nan;
		type = -1;
	end
end