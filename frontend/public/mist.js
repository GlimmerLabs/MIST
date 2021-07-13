/**
 * The basic MIST library.  Available at
 *   http://glimmer.grinnell.edu/js/mist.js
 *   http://glimmer.grinnell.edu/js/ugly.mist.js
 *
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var MIST = {};

try { module.exports = MIST; } catch (err) { }
/**
 * mist-functions.js
 *   Representations of functions, expressions, images, and so on
 *   and so forth.
 */

// +-------+---------------------------------------------------------
// | Notes |
// +-------+

/*
   1. We represent a variety of kinds of "things".

   a. Basic expressions (class MIST.Val), which include not only the
   built-in values, such as numbers, x, y, t.m, and so on and so forth,
   but also any *named* values (either parameters to functions or values
   we've taken from other folks).

   b. Compound expressions (class MIST.App), which are the application
   of an operation (function name) to zero or more expressions.

   c. Functions (class MIST.Fun), which add a list of the operand names.

   2. When we evaluate an expression, we may also have to set up the
   context in which to evaluate that expression (e.g., by evaluating
   a variety of name/expression pairs).

   3. All of these objects have a toString and a prettyPrint(indent)
   method.

   4. When you want to store any of these objects in the database, use
   `JSON.stringify` on the object.  When you want to restore the object,
   use `restore(JSON.parse(str))`, where `restore` comes from
   `mist-utils.js`.  (Unfortunately, JSON.parse does not restore prototypes,
   so we need to do that by hand.)

   Alternately, use MIST.rebuild on the resulting string, but that
   approach is deprecated.

   5. Many of the MIST functions rely on a MIST object.  We start each
   file with instructions to build that object.

   6. I'm still struggling with type checking.  I had originally assumed
   that RGB functions could only be applied to numeric values.  However,
   something like "lambda (a,b) rgb(first(a),b,b) should expect a to be
   a triplet.  (Of course, I could not allow extracting components of
   rgb and hsv values, which would restore my assumption.)
 */

// +-------+---------------------------------------------------------
// | Setup |
// +-------+

try { MIST = MIST; } catch (err) { MIST = new Object(); }

// +----------------------+------------------------------------------
// | Types of Expressions |
// +----------------------+

MIST.TYPE = {};

MIST.TYPE.RGB = "RGB";
MIST.TYPE.HSV = "HSV";
MIST.TYPE.NUMBER = "NUMBER";

/**
 * Determine the type of an expression, given a series of function
 * and value definitions.
 */
MIST.expType = function(exp,context) {
  // Long term: Scan through the expression.
  // Short term: Look at the top-level operation
  if (exp instanceof MIST.App) {
    if ((exp.operation == "rgb") || (exp.operation == "MIST.rgb")) {
      return MIST.TYPE.RGB;
    }
    else if (exp.operation == "hsv") {
      return MIST.TYPE.HSV;
    }
    else {
      return MIST.TYPE.NUMBER;
    }
  } // if it's an application

  // If it's just a value, we should look at the type of the value.
  // But right now, we assume we'll only have numeric contants and
  // not HSV or RGB constants.
  else {
    return MIST.TYPE.NUMBER;
  } // A value
} // MIST.expType

// +-------------------+---------------------------------------------
// | General Utilities |
// +-------------------+

/**
 * Determine if an array contains a value.
 */
function contains(array, val)
{
  for (var i = 0; i < array.length; i++) {
    if (array[i] == val) {
      return true;
    } // if
  } // for
  return false;
} // contains

/**
 * I like varargs procedures, but sometimes I want to pass in an
 * array instead.  So, call getArgs with the arguments 'array' and
 * the starting point for extracting the array.
 */
function getArgs(args, start)
{
  if (!start) { start = 0; }
  var arglen = args.length - start;
  if ((arglen == 1) && (args[start] instanceof Array)) {
    return args[start];
  } // if there's only one argument, and it's an array.
  else {
    var result = Array(arglen);
    for (var i = start; i < args.length; i++)
      result[i-start] = args[i];
    return result;
  } // getArgs
} // getArgs

/**
 * Create a string of n copies of ch
 */
function ncopies(n, ch)
{
  return Array(n+1).join(ch);
} // ncopies

/**
 * Create a string of n spaces.
 */
function nspaces(n)
{
  return ncopies(n, " ");
} // nspaces

// +----------------+------------------------------------------------
// | MIST Utilities |
// +----------------+

/**
 * Determine the depth of an expression.  Assumes that the expression has
 * no loops.
 */
MIST.depth = function(exp)
{
  // If it's an application
  if (exp instanceof MIST.App) {
    // Find the deepest child
    var deepest = 0;
    for (var i = 0; i < exp.operands.length; i++) {
      deepest = Math.max(deepest, MIST.depth(exp.operands[i]));
    } // for
    // And add 1
    return 1 + deepest;
  } // if it's an application

  // If it's not an application
  else {
    // Then the depth is 1
    return 1;
  } // if it's anything but an application
} // MIST.depth

/**
 * Determine if there is a loop in an expression.  (There should never
 * be, but ...)
 */
MIST.hasLoop = function(val, seen)
{
  if (!seen) { seen = []; }
  if (contains(seen,val)) {
    return true;
  }
  if (val instanceof MIST.App) {
    seen.push(val);
    for (var i = 0; i < val.operands.length; i++) {
      if (MIST.hasLoop(val.operands[i], seen)) {
        return true;
      } // if
    } // for
    seen.pop(val);
  }
  return false;
} // MIST.hasLoop

/**
 * Determine if an object is a MIST expression.
 */
MIST.isExp = function(val)
{
  return ((val instanceof MIST.Val) || (val instanceof MIST.App));
}; // MIST.isExp

/**
 * Determine if an object is a MIST function.
 */
MIST.isFun = function(val)
{
  return (val instanceof MIST.Fun);
}; // MIST.isFun

/**
 * Rebuild one of the MIST objects from JSON (or parsed JSON).
 */
MIST.rebuild = function(obj) {
  // If we start with a string, we assume it's JSON.
  if (typeof(obj) == "string") {
    try {
      return MIST.rebuild(JSON.parse(obj));
    } // try
    catch (err) {
      return obj;
    } // catch
  } // if it's a string

  // Handle the standard MIST. objects
  else if (obj.class == "MIST.Val") {
    return new MIST.Val(obj.name);
  }
  else if (obj.class == "MIST.App") {
    var operands = Array(obj.operands.length);
    for (var i = 0; i < obj.operands.length; i++) {
      operands[i] = MIST.rebuild(obj.operands[i]);
    } // for
    return new MIST.App(obj.operation, operands);
  }
  else if (obj.class == "MIST.Fun") {
    return new MIST.Fun(obj.parameters, MIST.rebuild(obj.body));
  }

  // Handle everything else
  return obj;
} // MIST.rebuild

/**
 * Determine if two expressions are the same
 */
MIST.sameExp = function(a,b,checkedLoops)
{
  // We'll assume that expressions with loops are different.  (We can
  // probably get partial similarity, but I'm pretty sure that the
  // Halting Problem suggests that I can't determine equality of
  // arbitrary loops, so I might as well not try.)
  if (!checkedLoops && (MIST.hasLoop(a) || MIST.hasLoop(b)))
    return false;

  // Two values are the same if the have the same name
  if ((a instanceof MIST.Val) && (b instanceof MIST.Val)) {
    return a.name == b.name;
  } // two values

  // Two expressions are the same if they have the same operations
  // and the same operands.
  if ((a instanceof MIST.App) && (b instanceof MIST.App)) {
    if (a.operation != b.operation) {
      return false;
    } // different operations
    if (a.operands.length != b.operands.length) {
      return false;
    } // different numbers of operands
    for (var i = 0; i < a.operands.length; i++) {
      if (!MIST.sameExp(a.operands[i], b.operands[i], true)) {
        return false;
      } // if the operands are different
    } // for
    // The operators and operands are the same.  They must be the same.
    return true;
  } // two expressions

  // Anything else is different
  return false;
} // MIST.sameExp

/**
 * Validate an expression:
 *   * Make sure that all of the parameters are of appropriate types.
 *   * Make sure that all of the functions are in the context or are
 *     standard functions.
 *   * Identify the type of the expression.
 *   * Identify whether or not the expression is animated.
 */

/*
MIST.validate = function(name, exp, context) {
  // Validate all of the expressions in the context

  // We'll assume that expressions that already have a type are
  // already validated.  (Trust your client?)
  if (exp.type && (exp.animated != undefined))
    return;

  // Case 1: Applications
  if (exp instanceof MIST.App) {
    var opInfo = context[exp.operator] ||
         MIST.builtins.functions[exp.operator];

    // Make sure that the operator is defined.
    if (!opInfo) {
      throw name + " includes unknown operation " + exp.operation;
    } // if the function is not defined

    // Validate all of the children.  Doing so should also set the
    // type and animated fields of the children.
    for (var i = 0; i < exp.operands.length; i++) {
      MIST.validate(name, exp.operands[i], context);
    } // for

    // Determine whether or not it's animated
    exp.animated = false;
    for (var i = 0; i < exp.operands.length; i++) {
      exp.animated = exp.animated || exp.operands[i].animated;
    } // for

    // For RGB functions, make sure that all parameters are numbers.
    if (opInfo.type == "RGB") {
      exp.type = MIST.TYPE.RGB;
      for (var i = 0; i < exp.operands.length; i++) {
        if (exp.operands[i].type != MIST.TYPE.NUMBER) {
          throw name ": RGB function " + opInfo.name +
              " applied to non-numeric value (" +
              exp.operands[i].toString() + ")";
        } // if an operand is not a number
      } // for
    } // if it's an RGB function

    else if (opInfo.type == "HSV") {
    } // if it's an HSV function

    else if (opInfo.type == "GENERAL") {
      for (var i = 0; i < exp.operands.length; i++) {
      } // for
    } // if it's a general function
    else {
      throw name + " includes unsupported operation " + exp.operation;
    }
  } // if it's an application

  else if (exp instanceof MIST.Val) {
  } // if it's a value
  else {
    throw "Could not validate " + name + " (" + exp + ")";
  } // if it's neither an application nor a value
} // MIST.validate
*/

// +-----------------+-----------------------------------------------
// | Class: MIST.App |
// +-----------------+

/**
 * The application of an operation to zero or more operands.
 */
MIST.App = function(operation) {
  this.class = "MIST.App";
  this.operation = operation;
  this.operands = getArgs(arguments,1);

  // Validate the operands
  for (var i = 0; i < this.operands.length; i++) {
    if (!MIST.isExp(this.operands[i])) {
      console.log(this.operands);
      throw "Subexpression " + i +  "is invalid: " + this.operands[i];
    } // if
  } // for

  // Build the code for this expression
  if (this.operands.length == 0)
    this.code = this.operation + "()";
  else
    this.code = this.operation + "(" + this.operands.join(",") + ")";
} // MIST.App

/**
 * Convert the application to a string.
 */
MIST.App.prototype.toString = function() {
  return this.code;
};

/**
 * Print the application, with all but the first line indented by
 * indent and with the last line followed by suffix.
 */
MIST.App.prototype.prettyPrint = function(indent,suffix) {
  if (!indent) { indent = ""; }
  if (!suffix) { suffix = "\n"; }
  var arity = this.operands.length;
  var newindent = indent + nspaces(this.operation.length+1);

  // If there are no operands
  if (arity == 0) {
    return this.operation + "()" + suffix;
  } // if there are no operands

  // If there's only one operand
  else if (arity == 1) {
    return this.operation + "(" + this.operands[0].prettyPrint(newindent, ")"+suffix);
  } // if there's only one operand

  // If there are more than one operand
  else {
    var result = this.operation + "(";
    result += this.operands[0].prettyPrint(newindent, ",\n");
    for (var i = 1; i < arity-1; i++) {
      result += newindent + this.operands[i].prettyPrint(newindent, ",\n");
    } // for
    result += newindent + this.operands[arity-1].prettyPrint(newindent, ")" + suffix);
    return result;
  } // has operands
}; // MIST.App.prettyPrint


// +-----------------+-----------------------------------------------
// | Class: MIST.Fun |
// +-----------------+

/**
 * MIST functions are expressions that have parameters.
 */
MIST.Fun = function(parameters, body)
{
  this.class = "MIST.Fun";
  // Note: Need to validate inputs.
  this.parameters = parameters;
  this.body = body;

  // Build the code for this function.
  this.code = "(function "
            + "(" + this.parameters.join(",") + ") "
            + "{ return " + this.body.toString() + "})";

} // MIST.Fun

/**
 * Convert to a string.
 */
MIST.Fun.prototype.toString = function() {
  return this.code;
} // toString

/**
 * Pretty print.
 */
MIST.Fun.prototype.prettyPrint = function (indent) {
  return this.body.prettyPrint(indent);
};

/**
 * Convert to an executable Javascript function.
 */
MIST.Fun.prototype.toFunction = function() {
  var code = "var " + this.name  + " = " + this.toString();
  eval(code);
  return eval(this.name);
};

// +-----------------+-----------------------------------------------
// | Class: MIST.Val |
// +-----------------+

/**
 * A basic value.  (Either a number of the name of something.)
 */
MIST.Val = function(name) {
  this.class = "MIST.Val";
  this.name = name;
  this.code = "" + name;
} // MIST.Val

/**
 * Convert to a string.
 */
MIST.Val.prototype.toString = function() {
  return this.code;
}; // MIST.Val.prototype.toString

/**
 * Print a value.
 */
MIST.Val.prototype.prettyPrint = function(indent,suffix) {
  if (!indent) { indent = ""; }
  if (!suffix) { suffix = "\n"; }
  return this.name + suffix;
}; // MIST.Val.prettyPrint

// +-----------------------+-----------------------------------------
// | Class: MIST.ImageGray |
// +-----------------------+

/**
 * Constructor:
 *   MIST.ImageGrey
 * Parameters:
 *   exp, a MIST. expression describing the image
 *   context, a bunch of hashes
 * Purpose:
 *   Create the description of a greyscale image.
 */
MIST.ImageGrey = function(exp)
{
  this.exp = exp;
  this.context = getArgs(arguments,1);
} // MIST.ImageGrey

// +------------------------+----------------------------------------
// | Class: MIST.Collection |
// +------------------------+

/*
  General collections of information.  Used primarily for storing
  the builtin functions, the user functions, the builtin values,
  and the user values.
 */

/**
 * Constructor.
 */
MIST.Collection = function(name, about) {
  this.class = "MIST.Collection";
  this.name = name;
  if (!this.name) {
    this.name = "<Untitled>";
  }
  this.about = about;
  if (!this.about) {
    this.about = "";
  }
  this.values = {};
} // MIST.Collection

/**
 * Get all of the keys.
 */
MIST.Collection.prototype.keys = function() {
  return Object.keys(this.values);
} // MIST.Collection.prototype.keys

/**
 * Clear the contents of the collection.
 */
MIST.Collection.prototype.clear = function() {
  this.values = {};
} // MIST.Collection.prototype.clear

/**
 * Add an object, which we will then index by name (we assume that all
 * objects have a .name field).
 *
 * If there's a .display field, also index the object by that value
 */
MIST.Collection.prototype.add = function(obj) {
  this.values[obj.name] = obj;
  if (obj.display) {
    this.values[obj.display] = obj;
  }
} // MIST.Collection.prototype.add

/**
 * Look up an object.
 */
MIST.Collection.prototype.get = function(name) {
  return this.values[name];
} // MIST.Collection.prototype.get

/**
 * Add a user function.
 */
MIST.Collection.prototype.addUserFun = function(name,display,about,params,code) {
  var numParams = 0;
  if (params) {
    numParams = params.split(",").length;
  }
  this.add(new MIST.FunInfo(name,display,about,params,
      {type:"GENERAL", minarity:numParams, maxArity:numParams, code:code}));
};

/**
 * Add a user value
 */
MIST.Collection.prototype.addUserVal = function(name,display,about,code) {
  this.add(new MIST.ValInfo(name,display,about,code));
}; // addUserVal

/**
 * Add a builtin function.
 */
MIST.Collection.prototype.addBuiltinFun = function(name,display,about,params,minarity,maxarity,type) {
  this.add(new MIST.FunInfo(name, display, about, params,
    {minarity:minarity, maxarity:maxarity, type:type}));
} // addBuiltinFun

// +-------------------+---------------------------------------------
// | Value Information |
// +-------------------+

MIST.ValInfo = function(name, display, about, other) {
  this.class = "MIST.ValInfo";
  this.name = name;
  this.display = display;
  this.about = about;
  for (var key in other) {
    this[key] = other[key];
  } // for
} // MIST.ValInfo

// +----------------------+------------------------------------------
// | Function Information |
// +----------------------+

/**
 * A bit of information on the installed functions.
 */
MIST.FunInfo = function(name, display, about, params, other) {
  this.class = "MIST.FunInfo";
  this.name = name;
  this.display = display;
  this.about = about;
  this.params = params;
  for (var key in other) {
    this[key] = other[key];
  } // for
} // MIST.FunInfo

// +---------+-------------------------------------------------------
// | Parsing |
// +---------+

/**
 * Patterns for alphabetic and digit characters.
 */
MIST.alpha = /[a-zA-Z]/;
MIST.digit = /[0-9]/;

/**
 * Token type.
 */
MIST.tokens = Object.freeze({UNKNOWN:0, OPEN:1, CLOSE:2, COMMA:3,
  ID:4, NUM:5, EOF:6});

/**
 * A token: One of the basic building blocks.
 */
MIST.Token = function(type,text,row,col)
{
  this.type = type;
  this.text = text;
  this.row = row;
  this.col = col;
} // MIST.Token

/**
 * An object that lets us read input one character at a time.
 */
MIST.Input = function(text)
{
  this.text = text;
  this.pos = 0;
  this.row = 1;
  this.col = 1;
  this.len = text.length;

  // Determine if we're at the end of the input
  this.eof = function() {
    return this.pos >= this.len;
  } // eof

  // Peek at the next input character
  this.peek = function() {
    if (this.eof())
      return undefined;
    else
      return this.text[this.pos];
  }; // peek

  // Get the next character
  this.next = function() {
    var c = this.peek();
    if (c == undefined) {
      return undefined;
    }
    else {
      var result = new MIST.Token(MIST.tokens.UNKNOWN, c,
          this.row, this.col);
      ++this.pos;
      ++this.col;
      if (c == "\n") {
        ++this.row;
        this.col = 1;
      }
      return result;
    }
  } // next()

  // Skip over whitespace
  this.skipWhitespace = function() {
    var ws = /[ \t\n]/;
    while (ws.test(this.peek())) {
      this.next();
    } // while
  } // skipWhitespace
} // MIST.Input

/**
 * Throw a parse or tokenize error.
 */
MIST.parseError = function(text, row, col) {
  if (row) MIST.row = row;
  if (col) MIST.col = col;
  throw "Error at line " + MIST.row + ", column " + MIST.col + ": " + text;
} // parseError

/**
 * Tokenize a string.
 */
MIST.tokenize = function(str) {
  var tokens = [];
  var input = new MIST.Input(str);
  input.skipWhitespace();
  while (!input.eof())
    {
      var ch = input.next();
      if (ch.text == "(") {
        ch.type = MIST.tokens.OPEN;
        tokens.push(ch);
      }
      else if (ch.text == ")") {
        ch.type = MIST.tokens.CLOSE;
        tokens.push(ch);
      }
      else if (ch.text == ",") {
        ch.type = MIST.tokens.COMMA;
        tokens.push(ch);
      }
      else if (/[0-9-.]/.test(ch.text)) {
        var num = ch.text;
        var c;
        var dot = (ch.text == ".");
        while ((c = input.peek()) &&
            (/[0-9]/.test(c) || (!dot && (c == ".")))) {
          input.next();
          num += c;
          if (c == ".") { dot = true; }
        } // while
        if (num == "-") {
          MIST.parseError("Singleton negative signs not allowed.",
            ch.row, ch.col);
        } // if we only saw a negative sign
        ch.type = MIST.tokens.NUM;
        ch.text = num;
        tokens.push(ch);
      }
      /* TODO: we're allowing underscores for custom variables, but that may
       * bring about other bugs (see the while statement inside of this, as well
       */
      else if (/[A-Za-z_]/.test(ch.text)) {
        var col = ch.col;
        var row = ch.row;
        var id = ch.text;
        var c;
        while ((c = input.peek()) && /[A-Za-z0-9._]/.test(c)) {
          id += c;
          input.next();
        } // while
        ch.type = MIST.tokens.ID;
        ch.text = id;
        tokens.push(ch);
      } // if it's an id
      else {
        MIST.parseError("Invalid character (" + ch.text + ")", ch.row, ch.col);
      } // else
      input.skipWhitespace();
    } // while
  tokens.push(new MIST.Token(MIST.tokens.EOF, "<eof>", input.row, input.col));
  return tokens;
} // MIST.tokenize

/**
 * Peek at the type of the next token.
 */
peekType = function(tokens) {
  if (!tokens[0])
    return MIST.tokens.UNKNOWN;
  else
    return tokens[0].type;
} // peekType

/**
 * Create a regular expression for sanitizing MIST code.
 */
MIST.createSanitizer = function() {
  var resultingRE = ""
  for(var i = 0; i<arguments.length-1;i++) {
    resultingRE += "(?:"+arguments[i]+")|"
  }
  resultingRE += "(?:"+arguments[arguments.length - 1]+")"
  var evaluated = new RegExp(resultingRE, "g");
  return evaluated
}

/**
 * Sanitize MIST code.
 */
MIST.sanitize = function(RE, string) {
  var result = string.match(RE).join("");
  return result
}

/**
 * Parse MIST code into a MIST expression.
 */
MIST.parse = function(str,prefix) {
  if (!prefix) { prefix=""; }

  // The kernel.  Does the work, also recurses.
  var kernel = function(tokens) {
    // This should never happen, but let's be safe.
    if (tokens.length == 0) {
      MIST.parseError("Unexpected end of input", 0, 0);
    }

    var tok = tokens.shift();

    // Check for end of input
    if (tok.type == MIST.tokens.EOF) {
      MIST.parseError("Unexpected end of input", tok.row, tok.col);
    }

    // Is it a number?
    if (tok.type == MIST.tokens.NUM) {
      return new MIST.Val(tok.text);
    } // MIST.tokens.NUM

    // Only identifiers and numbers are allowed at the top level.
    else if (tok.type != MIST.tokens.ID) {
      MIST.parseError("Unexpected token (" + tok.text + ")", tok.row, tok.col);
    } // if it's not an identifier

    // Is it a function call?
    else if (peekType(tokens) == MIST.tokens.OPEN) {
      tokens.shift();
      var children = [];
      while (peekType(tokens) != MIST.tokens.CLOSE) {
        children.push(kernel(tokens));
        if (peekType(tokens) == MIST.tokens.COMMA) {
          tokens.shift();
          if (peekType(tokens) == MIST.tokens.CLOSE) {
            MIST.parseError("Close paren follows comma", tokens[0].row, tokens[0].col);
          } // if there's a close paren after a comma
        } // if there's a comma
      } // while
      tokens.shift();
      return new MIST.App(prefix + tok.text, children);
    } // if it's a function call

    // Otherwise, it's a singleton
    else {
      return new MIST.Val(tok.text);
    } // if it's a singleton
  }; // kernel

  var tokens = MIST.tokenize(str);
  var result = kernel(tokens);
  if ((tokens.length > 1) || (peekType(tokens) != MIST.tokens.EOF)) {
    MIST.parseError("Extra text after expression", tokens[0].row,
      tokens[0].col);
  }
  return result;
} // MIST.parse

// +-------------------+---------------------------------------------
// | Simulated Objects |
// +-------------------+

/**
 * A mouse for cases in which someone has not passed in the mouse.
 */
function SimulatedMouse()
{
  this.x = 0;
  this.y = 0;
} // SimulatedMouse()

/**
 * A time for cases in which someone has not passed in the time.
 */
function SimulatedTime()
{
  this.s = 0;
  this.m = 0;
  this.h = 0;
  this.d = 0;
  this.y = 0;
} // SimulatedTime


function gifTime()
{
  var temp = new Date();
  this.ms = temp.getMilliseconds();
  this.s = temp.getSeconds();
  this.m = temp.getMinutes();
  this.h = temp.getHours();
  this.d = 0;
  this.y = 0;
} // gifTime


// +-------------+---------------------------------------------------
// | Quick Hacks |
// +-------------+

/**
 * Display a context.
 */
function displayContext(context)
{
  var args = getArgs(arguments);
  for (var i = 0; i < args.length; i++) {
    console.log(args[i]);
  } // for
} // displayContext

/**
 * Evaluate an expression in an environment.  (Intended as a bit of an
 * experiment for what we're likely to do in the render function.)
 */
function evalExp(exp)
{
  var env = getArgs(arguments,1);
  for (var i = 0; i < env.length; i++)
    {
      fun = env[i];
      console.log(fun);
      var code = fun.name + " = " + fun.toString();
      console.log(code);
      eval(code);
    }
  return eval(exp.toString());
} // evalExp

/**
 * Test getArgs
 */
function testArgs()
{
  return getArgs(arguments, 1);
} // testArgs

// +-----------------------+-----------------------------------------
// | Interpreting MIST Code |
// +-----------------------+

/**
 * MISTbody2fun
 *   Given the body of something that uses "raw" MIST, return the
 *   corresponding function.  (Note that we will generally not
 *   use "raw" MIST, but it's helpful for testing.)
 */
function MISTbody2fun(body)
{
  return eval("(function (x,y,t,m) { return " + body + "})");
} // MISTbody2fun

/**
 * Convert a MIST expression to something that returns an RGB
 * list. env is the 'environment' - a mapping of names to MIST
 * expressions
 */
MIST.expToRGB = function(name, exp, env) {
  const type = MIST.expType(exp, env);
  const {code: expString, variables} = MIST.simplifyCode(exp.code);
  const variableCode = variables.map(
    ({name, code}) => `const ${name} = ${code};`
  ).join("");

  const tmp = [];
   // Contexts as objects
  for (const c in env) {
    tmp.push("const " + c + " = " + env[c].toString());
  }
  const envCode = tmp.join(";");

  // For RGB functions
  //   function(x,y,t,m,p) {
  //      var env0 = def0;
  //      ...
  //      return (exp).map(r2c);
  //   };
  if (type === MIST.TYPE.RGB) {
    const code = "(function(x,y,t,m,p) { " + variableCode + envCode +
      "; return (" + expString + ").map(r2c); })";
     //console.log(code);
    return eval(code);
  }
  // For B&W functions
  //    function(x,y,t,m,p) {
  //      var env0 = def0;
  //      ...
  //      var _tmp_ = r2c(-exp);
  //      return [_tmp_, _tmp_, _tmp];
  else if (type === MIST.TYPE.NUMBER) {
    const code = "(function(x,y,t,m,p) { " + variableCode + envCode +
      "; var _tmp_ = r2c(-" + expString + "); return [_tmp_, _tmp_, _tmp_]; })";
    //console.log(code);
    return eval(code);
  }
  else {
    throw "Cannot handle expressions of type " + type;
  }
} // MIST.expToRGB

/*
  Some HSV notes for expToRGB
        h = r2h(cap(hfun(x,y,time,mouse)));
        s = r2sv(cap(sfun(x,y,time,mouse)));
        v = r2sv(cap(vfun(x,y,time,mouse)));

        var rgb = [];
        rgb = hsv2rgb(h, s, v);
 */

// +---------------------+-------------------------------------------
// | Comparing Functions |
// +---------------------+

/**
 * Maximum 'distance' for two components to be considered the same.
 * Remember that components have values in the range 0..255
 */
MIST.COMPONENT_EPSILON = 10;

/**
 * Percentage of pixels that must be similar for two functions to be
 * the same.
 */
MIST.PERCENT_MATCH = 0.95;

/**
 * Compare two functions, using their code.  Returns true
 * if they are similar and false if they are not.
 */
MIST.compareFun = function(code1,code2) {
  // Determine if we might have interactive images
  var timed = (code1.indexOf("t.") >= 0) || (code2.indexOf("t.") >= 0);
  var mouse = (code1.indexOf("m.") >= 0) || (code2.indexOf("m.") >= 0);

  // Pick the right comparison to use
  if (timed && mouse) {
    return MIST.compareFunCore(code1,code2,17);
  }
  else if (timed) {
    return MIST.compareFunCore(code1,code2,9);
  }
  else if (mouse) {
    return MIST.compareFunCore(code1,code2,9);
  }
  else {
    return MIST.compareFunCore(code1,code2);
  }
}; // MIST.compareFun

/**
 * Repeatedly compare code for two functions.  (We take advantage of
 * randomness in compareFunOnce to handle different mice and times.)
 */
MIST.compareFunCore = function(code1,code2,times) {
  if (!times) { times = 1; }
  var count = 0;
  var sum = 0;
  for (count = 0; count < times; count++) {
    sum += MIST.compareFunOnce(code1,code2);
  } // for
  return (sum/count >= MIST.PERCENT_MATCH);
} // compareFunCore

/**
 * Compare two functions, using their code.  Returns the percentage of
 * pixels that are 'close enough'.  (See the constants above.)
 */
MIST.compareFunOnce = function(code1,code2,time,mouse) {
  // Are two compnents similar?
  var similar = function(a,b) {
    var result = Math.abs(a-b) <= MIST.COMPONENT_EPSILON;
    // console.log("similar",a,b,result);
    return result;
  }; // similar

  // A random component
  var rand = function() {
    var result = 2*Math.random() - 1;
    return result;
  }; // rand

  // Fill in the optional parameters
  if (!time) {
    time = { s: rand(), m:rand(), h:rand(), d:rand() };
  }
  if (!mouse) {
    mouse = { x:rand(), y:rand(), X:rand(), Y:rand() };
  }

  // Parse the two pieces of code.
  try {
    var parsed1 = MIST.parse(code1);
    var parsed2 = MIST.parse(code2);
  } // try
  catch (err) {
    // If either fails to parse, we assume nothing is in common
    return 0;
  } // catch

  // Convert the two pieces of code into functions
  try {
    var fun1 = MIST.expToRGB("f1",parsed1,{});
    var fun2 = MIST.expToRGB("f2",parsed2,{});
  } // try
  catch (err) {
    // If either fails to convert, we assume nothing is in common
    return 0;
  } // catch

  // Set up counters
  var pixels = 0;
  var matches = 0;

  // Iterate through positions
  for (var x = -1; x <= 1; x += 0.1) {
    for (var y = -1; y <= 1; y+= 0.1) {
      var c1 = fun1(x, y, time, mouse);
      var c2 = fun2(x, y, time, mouse);
      pixels++;
      if (similar(c1[0],c2[0]) && similar(c1[1],c2[1]) && similar(c1[2],c2[2])) {
        matches++;
      } // if
    } // for y
  } // for x

  // Determine the percentage that match
  return matches/pixels;
} // compareFunOnce

/**
 * Compare code for two functions that use the mouse (but not time).
 * DEPRECATED.  We use randomness instead.
 */
MIST.compareFunMouse = function(code1,code2) {
  var count = 0;        // The count of the number of tests we do.
  var sum = 0;          // The sum of the percentages

  for (var x = -1; x <= 1; x += 0.25) {
    for (var y = -1; y <= 1; y += 0.25) {
      count++;
      sum += MIST.compareFunOnce(code1,code2,undefined,{x:x,y:y});
    } // for y
  } // for x

  return (sum/count >= MIST.PERCENT_MATCH);
} // compareFunMouse

/**
 * Compare code for two functions that use the time (but not mouse)
 * DEPRECATED.  We use randomness instead.
 */
MIST.compareFunTime = function(code1,code2) {
  var count = 0;        // The count of the number of tests we do.
  var sum = 0;          // The sum of the percentages

  for (var m = -1; m <= 1; m += 0.25) {
    for (var s = -1; s <= 1; s += 0.25) {
      count++;
      sum += MIST.compareFunOnce(code1,code2,{s:s,m:m,h:0,d:0});
    } // for y
  } // for x

  return (sum/count >= MIST.PERCENT_MATCH);
} // compareFunTime

// +--------------------+--------------------------------------------
// | Sample Expressions |
// +--------------------+

var plus = function()
  {
    var result = 0;
    for (var i = 0; i < arguments.length; i++)
      result += arguments[i];
    return result;
  };

var exp0 = new MIST.Val(1);
var exp1 = new MIST.App("plus", new MIST.Val("x"), new MIST.Val("y"));
var exp1a = new MIST.App("plus", new MIST.Val("x"), new MIST.Val("y"));
var exp2 = new MIST.App("times", exp0, exp1, exp1)
var exp3 = new MIST.Val("x");

var fun0 = new MIST.Fun([], exp0);

var fun1 = new MIST.Fun(["i"],
                       new MIST.App("plus",
                                   new MIST.Val(3),
                                   new MIST.Val("i")));

var fun2 = new MIST.Fun(["i"],
                       new MIST.App("plus",
                                    new MIST.Val("x"),
                                    new MIST.Val("i")));

var pp = function(str) {
  console.log(MIST.parse(str).prettyPrint());
}
/*
 * Create variables for common subsequences
 */
MIST.simplifyCode = function(code) {
  const MAX = 100;

  const root_node = MIST.parse(code);
  const nodes = {};

  /* Takes a number and returns a unique variable name */
  function get_variable(i) {
    const variable_names = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMLNOPQRSTUVWXYZ";
    if (i < variable_names.length) {
      // Start all variable names with an underscore to avoid conflicts with builtins
      return "_" + variable_names[i];
    } else {
      return get_variable(Math.floor(i / variable_names.length) - 1)
        + variable_names[i % variable_names.length];
    }
  }

  function count_occurences(node, nodes, depth=1) {
    // Don't try to count_occurences values
    if (node.class === "MIST.Val") {
      return;
    }
    if (!(node.code in nodes)) {
      nodes[node.code] = {depth: depth, times: 1};
    } else {
      nodes[node.code].times++;
    }
    if (node.operands) {
      node.operands.forEach(operand => count_occurences(operand, nodes, depth + 1));
    }
  }

  count_occurences(root_node, nodes);
  const keys = Object.keys(nodes);
  // TODO: consider weighting by function type/depth also
  const sorted = keys.filter(e => nodes[e].times > 1).sort((a, b) => (
    nodes[b].times - nodes[a].times
  )).slice(0, MAX);

  const code_to_variable = {};
  const variable_to_code = {}
  let variable_index = 0;
  sorted.forEach(key => {
    const varname = get_variable(variable_index++);
    code_to_variable[key] = varname;
    variable_to_code[varname] = key;
  });

  // Substitute common subsequences in the code with the corresponding variable
  let code_short = root_node.code;
  const code_order = Object.keys(code_to_variable).sort((a, b) => nodes[a].depth - nodes[b].depth);
  code_order.forEach(val => {
    while (code_short.indexOf(val) !== -1) {
      code_short = code_short.replace(val, code_to_variable[val]);
    }
  });

  // Substitute common subsequences in the variables with the corresponding variable
  const variable_order = Object.keys(variable_to_code).sort((a, b) => (
    nodes[variable_to_code[a]].depth - nodes[variable_to_code[b]].depth
  ));
  variable_order.forEach(varname => {
    variable_order.forEach(varname2 => {
      const code = variable_to_code[varname2]
      if (varname2 !== varname) {
        while (variable_to_code[varname].indexOf(code) !== -1) {
          variable_to_code[varname] = variable_to_code[varname].replace(code, varname2);
        }
      }
    });
  })

  return {
    variables: variable_order.reverse().map(varname => ({
      name: varname,
      code: variable_to_code[varname]
    })),
    code: code_short
  };
}
/**
 * Convert a MIST expression into a WebGL fragment shader
 */
MIST.expToGL = (function() {
  const literals = {
    x: "x",
    y: "y",
    "t.s": "t.x",
    "t.m": "t.y",
    "t.h": "t.z",
    "t.d": "t.w",
    "m.x": "m.x",
    "m.y": "m.y"
  };

  function func(name, limit) {
    if (limit) {
      return function() {
        return `${name}(${[...arguments].slice(0, limit).join(",")})`;
      }
    } else {
      return function() {
        return `${name}(${[...arguments].join(",")})`;
      }
    }
  }

  function joiner(name) {
    return function() {
      return `(${[...arguments].map(arg => "(" + arg + ")").join(name)})`;
    }
  }

  const functions = {
    cos: func("COS", 1),
    sign: func("SIGN", 1),
    sin: func("SIN", 1),
    square: func("SQUARE", 1),
    wrap: func("WRAP", 1),
    mistif: func("MISTIF", 3),
    
    abs: func("abs"),
    signz: func("sign"),

    mult: joiner("*"),
    sum: joiner("+"),
    
    // rgb is the only function that returns an object because it uses a different fragment shader
    rgb(r, g, b) {
      return {r: r, g: g, b: b};
    },

    neg(x) {
      return `(-(${x}))`;
    },

    avg() {
      return `(${this.sum.apply(this, arguments)}/${arguments.length}.0)`;
    },

    wsum() {
      return this.wrap(this.sum.apply(this, arguments));
    },
  }

  function to_gl(node) {
    if (node.class == "MIST.Val") {
      if (node.name in literals) {
        return literals[node.name]
      } else {
        let val = parseFloat(node.name);
        if (isNaN(val)) {
          // return -1.0 on unknown literals
          return "-1.0";
        } else {
          val = val.toString();
          // add a .0 to integers to turn them into floats
          return (val.search(/[.e]/) == -1) ? val + ".0" : val;
        }
      }
    } else if (node.class == "MIST.App") {
      if (node.operation in functions) {
        return functions[node.operation].apply(functions, node.operands.map(to_gl));
      } else {
        return "-1.0";
      }
    } else {
      return "-1.0";
    }
  }

  const fs = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH 
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform vec4 u_time;

    #define PI 3.1415926535897932384626433832795
    #define CTM(x) ((x) * 2.0 - 1.0)
    #define MTC(x) (((x) + 1.0) / 2.0)
    #define SIN(x) sin((x) * PI)
    #define COS(x) cos((x) * PI)
    #define SQUARE(x) ((x) * (x))
    #define SIGN(x) ((x) >= 0.0 ? 1.0 : -1.0)
    #define MISTIF(test, pos, neg) ((test) >= 0.0 ? (pos) : (neg))

    float WRAP(float val) {
      if (val > 1.0) {
        float res = mod((val + 1.0), 2.0) - 1.0;
        // This case ensures a nonbreaking change with the recursive version
        if (res == -1.0)
          return 1.0;
        return res;
      }
      if (val < -1.0) {
        float res = -(mod((-val + 1.0), 2.0) - 1.0);
        // This case ensures a nonbreaking change with the recursive version
        if (res == 1.0)
          return -1.0;
        return res;
      }
      return val;
    }

    void main() {
      float x = CTM(gl_FragCoord.x / u_resolution.x);
      float y = -CTM(gl_FragCoord.y / u_resolution.y); // WebGL has the opposite y-axis orientation
      vec2 m = u_mouse;
      vec4 t = u_time;
      {calc_color}
    }
  `;

  const fs_bw = `
    float col = 1.0 - MTC({calc});
    gl_FragColor = vec4(col, col, col, 1);
  `

  const fs_rgb = `
    float r = MTC({r});
    float g = MTC({g});
    float b = MTC({b});
    gl_FragColor = vec4(r, g, b, 1);
  `;

  return function(exp) {
    const fragment = to_gl(exp);
    if (MIST.expType(exp) == MIST.TYPE.RGB) {
      return fs.replace(
        "{calc_color}",
        fs_rgb.replace(
          "{r}", fragment.r || "-1.0"
        ).replace(
          "{g}", fragment.g || "-1.0"
        ).replace(
          "{b}", fragment.b || "-1.0"
        )
      );
    } else {
      return fs.replace("{calc_color}", fs_bw.replace("{calc}", fragment));
    }
  };
})();
/**
 * mist-builtin-functions.js
 *   The collection of builtin functions
 */

// +-------+---------------------------------------------------------
// | Setup |
// +-------+

try { MIST; } catch (err) { MIST = {}; }
if (!MIST.builtins) { MIST.builtins = {}; }

// +----------------------+------------------------------------------
// | Function Information |
// +----------------------+

MIST.builtins.functions = new MIST.Collection();

// I'd like to be able to write 
//   BUILTIN = MIST.builtins.functions.addBuiltinFun
// But that seems to be illegal.
function BUILTIN() {
  MIST.builtins.functions.addBuiltinFun.apply(MIST.builtins.functions, 
    arguments);
}

// +-----------+-----------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Convert a value in the range [-1 .. 1] to a component.
 */
function r2c(r)
{
  return 127.5 + r*127.5;
} // r2c

/**
 * Convert a component to a value in the range [-1 .. 1].
 */
function c2r(c)
{
  return (c/127.5) - 1.0;
} // c2r

/**
 * Restrict a value to a particular range.
 */
function cap(val)
{
  return Math.max(-1, Math.min(1, val));
} // cap

/**
 * Wrap around
 */
function wrap(val)
{
  if (val < -1)
    return wrap (val + 2);
  else if (val > 1)
    return wrap (val - 2);
  else
    return val;
} // wrap
MIST.wrap = wrap;
 
// +-------------------+---------------------------------------------
// | Builtin Functions |
// +-------------------+

var abs = function(i) {
  return Math.abs(i);
}; // abs
MIST.abs = abs;
BUILTIN("abs", "abs", "The absolute value of i", "i", 
  1, 1, "GENERAL");

var average = function(a) {
  return sum.apply(this, arguments)/arguments.length;
}; // average
var avg = average;
MIST.avg = average;
MIST.average = average;
BUILTIN("average", "avg", "Average 2 or more values", "...",
  2, 20, "GENERAL");
   
var cosine = function(a) {
  return Math.cos(Math.PI * a);
}; // cosine
var cos = cosine;
MIST.cos = cosine;
MIST.cosine = cosine;
BUILTIN("cosine", "cos", "The cosine of pi*a", "a",
  1, 1, "GENERAL");

var multiply = function() {
  var product = 1;
  for (var i = 0; i < arguments.length; i++) {
    product *= arguments[i];
  }
  return product;
}; // multiply
var mult = multiply;
MIST.mult = multiply;
MIST.multiply = multiply;
BUILTIN("multiply", "mult", "Multiply 2 or more values", "...",
  2, 20, "GENERAL");

var negate = function(value)
{
 return -value;
};
var neg = negate;
MIST.negate = negate;
MIST.neg = negate;
BUILTIN("negate", "neg", "negates value");

var rgb = function(r,g,b) {
  return [r,g,b];
}; // rgb
MIST.rgb = rgb;
BUILTIN("rgb", "rgb", "Generate an RGB color from red, green, and blue components", "r,g,b", 3, 3, "RGB");

var sign = function(range) {
  if (range < 0) 
    return -1;
  else 
    return 1;
}; 
MIST.sign = sign;
BUILTIN("sign", "sign", 
  "If i < 0, returns -1; if i >- 0, returns 1", "i", 1, 1, "GENERAL");

var signz = function(range)
{
  if (range < 0) 
    return -1;
  else if (range > 0)
    return 1;
  else
    return range;
}; 
MIST.signz = signz;
BUILTIN("signz", "signz", 
  "If i < 0, returns -1; if i > 0, returns 1; if i is 0, returns 1.",
  "i", 1, 1, "GENERAL");

var sine = function(a) {
    return Math.sin(Math.PI * a);
};
var sin = sine;
MIST.sine = sine;
MIST.sin = sine;
BUILTIN("sine", "sin", "The sine of pi*a", "a",
  1, 1, "GENERAL");

var square = function(i) {
  return i*i;
} // square
BUILTIN("square", "square", "Square i", "i", 1, 1, "GENERAL");

var sum = function() {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  } 
  return sum;
}; // sum
MIST.sum = sum;
BUILTIN("sum", "sum", "Sum 2 or more values.  If the sum would exceed 1, has the value 1.  If the sum would be less than -1, has the value -1", "...", 2, 20, "GENERAL");

var wrapsum = function() {
    return wrap(sum.apply(this, arguments));
};
var wsum = wrapsum;
MIST.wrapsum = wrapsum;
MIST.wsum = wrapsum;
BUILTIN("wrapsum", "wsum", "Sum 2 or more values, wrapping around from 1 to -1 (or vice versa) if the sum is too large or too small", "...", 2, 20, "GENERAL");

var mistif = function(test, pos, neg) {
  if (test >= 0) 
    return pos;
  else
    return neg;
};
BUILTIN("mistif", "if", "if test is greater than or equal to zero, return pos, if test is less than zero, return neg", "test, pos, neg", 3, 3, "GENERAL");
/**
 * mist-layout.js
 *   Information on the layout of a MIST editing session.
 */

// +-------+-----------------------------------------------------------
// | Notes |
// +-------+

/*
   1. Layouts allow you to add values (addVal), add operations (addOp),
      and add edges (addEdge).

   2. You can then display a layout using MIST.displayLayout.  (I made
      it a separate function to ease dealing with JSON.)

   3. You can store a layout in a database by converting it to a string
      with JSON.stringify.  When you retrieve it, you can either display
      it with MIST.displayLayout or (probably better) convert it back
      to a real MIST.Layout with MIST.rebuildLayout.

   4. In rebuilding layouts from JSON, I'm preserving the ids of nodes.
      Is that neccessary?  I could also set up a hash that maps old
      ids to new ids.  Note that I've had to extend addOp and addVal
      to take in a specified id.

   5. There's a lot of similarlity between MIST.displayLayout and
      MIST.rebuildLayout.  Over the longer term, I should figure out 
      how to rewrite MIST.rebuildLayout in terms of MIST.displayLayout.
 */

// +-------+-----------------------------------------------------------
// | Setup |
// +-------+

try { MIST = MIST; } catch (err) { MIST = new Object(); }

// +--------+----------------------------------------------------------
// | Layout |
// +--------+

MIST.Layout = function()
{
  // +--------+------------------------------------------------------
  // | Fields |
  // +--------+

  this.class = "MIST.Layout";

  // For convenience, we number things starting at 1000
  this.num = 1000;

  // All of the operation nodes
  this.operations = {};

  // All of the value nodes
  this.values = {};

  // All of the edges
  this.edges = [];

  // +----------+----------------------------------------------------
  // | Mutators |
  // +----------+

  /**
   * Add an edge from source to the ith input of sink.
   */
  this.addEdge = function(source, sink, i)
  {
    this.edges.push({ source:source, sink:sink, i:i });
  }; // addEdge

  /**
   * Add a new function node at (x,y).  Returns an identifier that you 
   * can use to refer to the node.
   */
  this.addOp = function(name, x, y, id)
  {
    if (!id) { id = "F" + this.num++; }
    this.operations[id] = { id:id, name:name, x:x, y:y };
    return id;
  }; // addOp

  /**
   * Add a new value node at (x,y).  Returns an identifier that you can 
   * use to refer to the node.
   */
  this.addVal = function(name, x, y, id)
  {
    if (!id) { id = "V" + this.num++; }
    this.values[id] = { id:id, name:name, x:x, y:y };
    return id;
  }; // addVal

  // +-----------+---------------------------------------------------
  // | Accessors |
  // +-----------+

  /**
   * Get a function node.  
   */
  this.getFun = function(id) 
  {
    return this.operations[id];
  }; // getFun

  /**
   * Get a value node.
   */
  this.getVal = function(id)
  {
    return this.values[id];
  }; // getVal
} // MIST.Layout

// +----------------------+------------------------------------------
// | Additional Functions |
// +----------------------+

/**
 * Display a layout-like object (either a real Layout object or the
 * object without the functions as given by JSON.parse) using 
 * display.addOp to display operations, display.addVal to display 
 * values, and display.addEdge to display edges.
 */
MIST.displayLayout = function(layout, display)
{
  var things = {};

  // Process all of the operations
  for (var id in layout.operations) {
    var op = layout.operations[id];
    things[id] = display.addOp(op.name, op.x, op.y);
  } // for

  // Process all of the values
  for (var id in layout.values) {
    var val = layout.values[id];
    things[id] = display.addVal(val.name, val.x, val.y);
  } // for
  
  // Process all of the edges
  for (var i = 0; i < layout.edges.length; i++) {
    var edge = layout.edges[i];
    var source = layout.operations[edge.source] || layout.values[edge.source];
    if (!source) {
      throw "Invalid source in edge from " + edge.source + " to " + edge.sink;
    }
    var sink = layout.operations[edge.sink];
    if (!sink) {
      throw "Invalid sink in edge from " + edge.source + " to " + edge.sink;
    }
    display.addEdge(things[source.id], things[sink.id], edge.i);
  } // for
}; // MIST.displayLayout

/**
 * Rebuild a layout from a parsed (or unparsed) JSON string.
 */
MIST.rebuildLayout = function(layout)
{
  if (typeof(layout) == "string")
    return MIST.rebuildlayout(JSON.parse(layout));
  
  if (layout.class != "MIST.Layout")
    throw "Error: Parameter is not a layout.";

  var result = new MIST.Layout();

  MIST.displayLayout(layout, result);
  return result;

  // Add all of the operations
  for (var id in layout.operations) {
    var op = layout.operations[id];
    result.addOp(op.name, op.x, op.y, op.id);
  } // for

  // Add all of the values
  for (var id in layout.values) {
    var val = layout.values[id];
    result.addVal(val.name, val.x, val.y, val.id);
  } // for
  
  // Add all of the edges
  for (var i = 0; i < layout.edges.length; i++) {
    var edge = layout.edges[i];
    result.addEdge(edge.source, edge.sink, edge.i);
  } // for

  // And we're done
  return result;
}; // rebuildLayout

// +--------------------------+--------------------------------------
// | Sample Display Functions |
// +--------------------------+


var sampleDisplay = new Object();

sampleDisplay.displayCount = 2000;
sampleDisplay.addEdge = function(source,sink,i)
{
  console.log("Connect " + source + " to " + sink + "/" + i);
} // displayEdge

sampleDisplay.addOp = function(op,x,y)
{
  var id = "N" + this.displayCount++;
  console.log(id + ": OPERATION " + op + " at (" + x + "," + y + ")");
  return id;
} // displayOp

sampleDisplay.addVal = function(op,x,y)
{
  var id = "N" + this.displayCount++;
  console.log(id + ": VALUE " + op + " at (" + x + "," + y + ")");
  return id;
} 

// +---------------+-------------------------------------------------
// | Sample Layout |
// +---------------+

var sampleLayout = new MIST.Layout();
var add = sampleLayout.addOp("add", 100, 100);
var x = sampleLayout.addVal("x", 50, 50);
var y = sampleLayout.addVal("y", 50, 150);
var tmp = sampleLayout.addOp("sine", 150, 100);
sampleLayout.addEdge(x, add, 0);
sampleLayout.addEdge(y, add, 1);
sampleLayout.addEdge(add, tmp, 0);
/**
 * mist-functions-layout
 *   Instructions for laying out mist functions.
 */

// +-------+-----------------------------------------------------------
// | Setup |
// +-------+

try { MIST = MIST; } catch (err) { MIST = new Object(); }

// +----------+--------------------------------------------------------
// | Settings |
// +----------+

/**
 * The horizontal offset between "columns".
 */
MIST.hoff = 30;

/**
 * The vertical offset between "rows".
 */
MIST.voff = 20;

// +-----------+-----------------------------------------------------
// | Functions |
// +-----------+

/**
 * Make a basic layout for an expression.
 */
MIST.basicLayout = function(exp)
{
  // Prepare a layout for the data
  var layout = new MIST.Layout();
  // Determine the depth of the expression
  var depth = MIST.depth(exp);
  // Set up an array to keep track of how many nodes there are at
  // each level
  var counts = [];
  for (var i = 0; i <= depth; i++) {
    counts[i] = 1;
  } // for
  // We're going to need to recurse through the tree, so set up a
  // kernel to do so.  The kernel returns the id of the current
  // expression
  var kernel = function(exp,depth) {
    if (exp instanceof MIST.Val) {
      return layout.addVal(exp.name, 
                           MIST.hoff*depth, 
                           MIST.voff*(counts[depth]++));
    } // if it's a value
    else if (exp instanceof MIST.App) {
      var id = layout.addVal(exp.operation, 
                             MIST.hoff*depth, 
                             MIST.voff*(counts[depth]++));
      for (var i = 0; i < exp.operands.length; i++) {
        var tmp = kernel(exp.operands[i], depth-1);
        layout.addEdge(tmp, id, i);
      } // for
      return id;
    } // if it's an application
    else {
      throw "Invalid expression."
    } // if it's anthing else
  }; // kernel

  // Run the kernel
  kernel(exp,depth);
} // MIST.baseLaout
/**
 * mist-render.js
 *   A library for rendering MIST functions.
 */

// +-------+---------------------------------------------------------
// | Setup |
// +-------+

try { MIST; } catch (err) { MIST = {}; }

// +-----------+-----------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Convert a value in the range [-1 .. 1] to a hue.
 */
function r2h(r) {
  return 180 + r*180;
}

/**
 * Convert a value in the range [-1 .. 1] to a saturation or value.
 */
function r2sv(r) {
  return .5 + r*.5;
}

/**
 * Converts hsv values to rgb values.
 */
function hsv2rgb(h, s, v) {
  var rgb = [];
  if (s === 0)
      rgb = [v, v, v];
  else {
    var c = v * s;
    var h2 = h / 60;
    var x = c*( 1 - Math.abs((h2 % 2) - 1));
    if (h2 >= 5) {
      rgb = [c, 0, x];
    }
    else if (h2 >= 4) {
      rgb = [x, 0, c];
    }
    else if (h2 >= 3) {
      rgb = [0, x, c];
    }
    else if (h2 >= 2) {
      rgb = [0, c, x];
    }
    else if (h2 >= 1) {
      rgb = [x, c, 0];
    }
    else {
      rgb = [c, x, 0];
    }
  } // if (s != 0)

  var m = v - c;
  rgb[0] = r2c (rgb[0] + m);
  rgb[1] = r2c (rgb[1] + m);
  rgb[2] = r2c (rgb[2] + m);
  return rgb;
}

/**
 * Convert a value in the range [-1 .. 1] to a component.
 */
function r2c(r)
{
  return 127.5 + r*127.5;
} // r2c

/**
 * Convert a component to a value in the range [-1 .. 1].
 */
function c2r(c)
{
  return (c/127.5) - 1.0;
} // c2r


// +-------------------+---------------------------------------------
// | Mouse Information |
// +-------------------+

/*
  Note: Rather than having mouse listeners here, we expect the GUI
  to keep us updated on where the mouse is and where it was last
  clicked.
 */

MIST.mouseX = 0;
MIST.mouseY = 0;
MIST.clickX = 0;
MIST.clickY = 0;

function setMouse(x, y)
{
  MIST.mouseX = x;
  MIST.mouseY = y;
} // setMouse

function setClick(x, y)
{
  MIST.clickX = x;
  MIST.clickY = y;
} // setClick

// +---------+-------------------------------------------------------
// | Objects |
// +---------+

/**
 * Simple representations of time using the range model (everything
 * is in the range [-1 .. 1]).
 */
function Time(sec,min)
{
  this.s = sec;
  this.m = min;
}  // Time(sec,min)

/**
 * Information on where the mouse is/was
 */
function Mouse(x, y, cx, cy)
{
  this.x = x;
  this.y = y;
  this.X = cx;
  this.Y = cy;
} // Mouse

// +---------------------+-------------------------------------------
// | Simulated Renderers |
// +---------------------+

/**
 * Render an expression on the specified region of the canvas.
 * (If no region is specified, uses the whole canvas.)
 */


MIST.render = function(exp, context, canvas, renderWidth, renderHeight,
    imgLeft, imgTop, imgWidth, imgHeight, renderData) {
  // Get the time.
  var d = new Date();
 

 var t = {
    s: d.getMilliseconds()/500 - 1,
    m: (d.getSeconds()*1000 + d.getMilliseconds())/30000 - 1,
    h: (d.getMinutes()*60 + d.getSeconds())/1800 - 1,
    d: (d.getHours()*60 + d.getMinutes())/720 - 1
  }; 

  // Use the core function
  const newRenderData = MIST.renderAt(t, exp, context, canvas, renderWidth,
    renderHeight, imgLeft, imgTop, imgWidth, imgHeight, renderData);
  // Return the time (for use elsewhere)
  return {time: t, renderData: newRenderData};
} // MIST.render

MIST.renderGIF = function(d, exp, context, canvas, renderWidth, renderHeight, 
    imgLeft, imgTop, imgWidth, imgHeight, renderData) {

  var t = {
    s: d.ms / 500 - 1,
    m: ( d.s * 1000 + d.ms)/30000 - 1,
    h: ( d.m * 60 + d.s)/1800 - 1,
    d: ( d.h * 60 + d.m)/720 - 1
  };

  // Use the core function
  MIST.renderAt(t, exp, context, canvas, renderWidth, renderHeight,
      imgLeft, imgTop, imgWidth, imgHeight, renderData);
  // Return the time (for use elsewhere)
  return t;
} // MIST.renderGIF

/**
 * Render an expression at a particular time.
 * Note that renderAt is wrapped in a IIFE in order to encapsulate the buffer canvas
 */
MIST.renderAt = (function() {
  const buffer = document.createElement("canvas");

  let bufferContext;
  let contextIsWebGL = false;
  let vertex_shader;
  bufferContext = buffer.getContext("webgl") || buffer.getContext("experimental-webgl");
  if (bufferContext) {
    contextIsWebGL = true;
    vertex_shader = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;
  } else {
    bufferContext = buffer.getContext("2d");
  }

  return function(t, exp, context, canvas, 
    renderWidth, renderHeight, imgLeft, imgTop, imgWidth, imgHeight,
    renderData) {
    // Make sure that we have bounds.
    if (!imgLeft) { imgLeft = 0; }
    if (!imgTop) { imgTop = 0; }
    if (!imgWidth) { imgWidth = canvas.width - imgLeft; }
    if (!imgHeight) { imgHeight = canvas.height - imgTop; }
    if (!renderWidth) { renderWidth = imgWidth; }
    if (!renderHeight) { renderHeight = imgHeight; }
    if (renderWidth > imgWidth) { renderWidth = imgWidth; }
    if (renderHeight > imgHeight) { renderHeight = imgHeight; }

    // Make sure that the rendering width and height are whole numbers
    renderWidth = Math.round(renderWidth);
    renderHeight = Math.round(renderHeight);

    buffer.width = renderWidth;
    buffer.height = renderHeight;

    // Get context for the canvas
    const canvasContext = canvas.getContext("2d");

    if (contextIsWebGL) {
      if (!renderData) {
        const programInfo = twgl.createProgramInfo(bufferContext, [vertex_shader,
          MIST.expToGL(exp)]);
        const arrays = {
          // a_position holds the positions of six vertices
          // that define two triangles, which take up the entire screen
          a_position: [-1, -1, 0, -1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1,
            0]
        };
        const bufferInfo = twgl.createBufferInfoFromArrays(bufferContext,
          arrays);
        renderData = {programInfo, bufferInfo};
      }

      bufferContext.canvas.width = renderWidth;
      bufferContext.canvas.height = renderHeight;
      bufferContext.viewport(0, 0, bufferContext.canvas.width,
        bufferContext.canvas.height);

      const uniforms = {
        u_resolution: [bufferContext.canvas.width, bufferContext.canvas.height],
        u_mouse: [MIST.mouseX, MIST.mouseY],
        u_time: [t.s, t.m, t.h, t.d]
      };

      bufferContext.useProgram(renderData.programInfo.program);
      twgl.setBuffersAndAttributes(bufferContext, renderData.programInfo,
        renderData.bufferInfo);
      twgl.setUniforms(renderData.programInfo, uniforms);
      twgl.drawBufferInfo(bufferContext, renderData.bufferInfo);
    } else {
      // Set up how much we change x and y each time.
      const deltaX = 2.0/renderWidth;
      const deltaY = 2.0/renderHeight;

      // Set up the image data
      const region = bufferContext.createImageData(renderWidth,renderHeight);

      // Set up the mouse (we don't want it changing while rendering).
      const m = {
        x: MIST.mouseX,
        y: MIST.mouseY,
        X: MIST.clickX,
        Y: MIST.clickY
      };

      if (!renderData) {
        // Build the function
        renderData = {fun: MIST.expToRGB("untitled image", exp, context)};
      }
      const fun = renderData.fun;
      // Set up our main variables
      let x = -1;
      let y = -1 - deltaY;

      // Loop through all of the pixels
      for (let i = 0; i < region.data.length; i+= 4)
        {
          // When we reach the end of the row, move on to the next row
          if ((i % (4*renderWidth)) == 0)
            { 
              x = -1;
              y += deltaY;
            } // if (i % (4*imgWidth)) == 0

          // Evaluate the function
          const rgb = fun(x,y,t,m);

          // Copy the pixels
          region.data[i+0] = rgb[0];
          region.data[i+1] = rgb[1];
          region.data[i+2] = rgb[2];
          region.data[i+3] = 255;
     
          // And advance to the next pixel
          x += deltaX;
        } // for

      // Draw and scale
      bufferContext.putImageData(region, 0, 0);
    }
    canvasContext.drawImage(buffer, imgLeft, imgTop, imgWidth, imgHeight);
    return renderData;
  }
})() // MIST.renderAt
/**
 * mist-utils.js
 *   A few assorted utilities for MIST and other applications.
 *
 * api(action,params,callback)
 *   Call one of the API routines.
 * contains(array,val)
 *   Determine if an array contains a value
 * restore(obj)
 *   Restore the prototypes for an object using a .class field to
 *   identify the class.
 */

/**
 * Call an API routine.  The callback takes two parameters: the response
 * and an optional error.
 */
function api(action,params,callback,method) {
  if (!callback) {
    callback = function(result,error) { return [result,error]; };
  }
  if (!method) {
    method = "POST";
  }
  var keys = Object.keys(params);
  var stuff = keys.map(function(k) { return k + "=" + params[k]});
  var data = "action=" + action + "&" + stuff.join("&");
  console.log(data);
  var request = new XMLHttpRequest();
  // If we're supposed to post the request ...
  if (method == "POST") {
    request.open("POST", "/api", false);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(data);
  } // if POST
  // Otherwise, we can just use GET.
  else {
    request.open("GET", "/api?" + data, false);
    request.send();
  } // if GET

  if (request.status != 200) {
    console.log("failed", request.responseText);
    return callback(false, request.responseText);
  }
  else {
    console.log("succeeded", request.responseText);
    return callback(request.responseText, false);
  }
} // api

/**
 * Determine if an array contains a value.
 */
function contains(array, val)
{
  for (var i = 0; i < array.length; i++) {
    if (array[i] == val) {
      return true;
    } // if
  } // for
  return false;
} // contains

/**
 * Restore the prototypes in an object built from JSON.
 */
function restore(obj) {
  // We only work with objects.
  if (typeof(obj) != "object") {
    return;
  } // if it's an object

  // Set up the collection of objects to process
  var unprocessed = [obj];

  // Set up a collection of objects already processed
  var processed = [];

  // While unprocessed things remain
  while (unprocessed.length > 0) {
    // Grab the next value
    var val = unprocessed.pop();

    // Remember that we've processed it.
    processed.push(val);

    // If the object does not yet have a prototype, and it has a
    // class field, set the prototype using that field.
    if ((val.__proto__ == Object.prototype) && (val.class != undefined)) {
      try {
        val.__proto__ = eval(val.class + ".prototype");
      } 
      catch (err) {
        // Do nothing
      }
    } // if it needs a prototype

    // Recurse on the children
    for (var key in val) {
      var child = val[key];
      if ((typeof(child) == "object") && (!contains(unprocessed,child))
          && (!contains(processed,child))) {
        unprocessed.push(child);
      } // if it's a new object
    } // for each child
  } // while
} // restore(obj)
