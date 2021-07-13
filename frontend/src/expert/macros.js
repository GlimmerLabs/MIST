/**
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

/**
 * macros.js
 *   Exports the default function expand_macros(mist_string, macros),
 *   which expands the user-defined macros of macros in mist_string
 * Author: Daniel Rebelsky
 */

// +-------+---------------------------------------------------------
// | Notes |
// +-------+

/* 
 * There are four important "types"/variables used throughout this program.
 *
 *  1. macro: A macro is an object with two keys: "code" and "params".
 *    "code" should be a MIST-expression String (MIST.Parse should be able to
 *    run on it); note that "code" may contain other macros.
 *
 *    "params" should be an array of strings, where each string represents a
 *    parameter of the macro.
 *
 *  2. macros: Throughout the program macros is an object that stores a
 *  collection of macros. Each key is the name of a macro except for the special
 *  key, "_order", which is an array of Strings, where each String is a key of
 *  the object. The array _order corresponds to the order in which the macros are
 *  parsed.
 *
 *  3. node: a node is of type MIST.App or MIST.Val.
 *
 *  4. templates: templates throughout the program is an object that maps macro
 *  names to template strings.
 *    a template string is a String for a macro where all of the submacros are
 *    expanded and every parameter is surrounded by curly braces.
 */

/* At some point, we will probably we want to turn the old MIST libraries into
 * ES6 style modules, but until then, we can grab the parse method from the
 * global MIST object.
 */
const {parse, Val} = window.MIST;

/*
 * _make_template_string takes an AST for a macro and converts into a template
 * string. A template string has macro parameters surrounded with curly braces
 * and has any sub-macros fully expanded.
 *
 * params is a Set of Strings, where each String is a parameter for the macro.
 */
function _make_template_string(node, params, templates, macros) {
  switch (node.class) {
    case "MIST.Val":
      if (params.has(node.name)) {
        return `{${node.name}}`;
      }
      // Allow 0 parameter macros to be input without parentheses
      if (node.name in templates && macros[node.name].params.length === 0) {
        return templates[node.name];
      }
      return node.name;
    case "MIST.App":
      const {operation, operands} = node;
      if (operation in templates) {
        node.operands = operands.map(operand => (
          new Val(_make_template_string(operand, params, templates, macros))
        ));
        return _expand_macros(
          node,
          templates,
          macros
        );
      }
      return `${operation}(${operands.map(operand => (
        _make_template_string(operand, params, templates, macros)
      )).join(',')})`;
    default:
      throw TypeError(`Unknown node type ${node.class}`);
  }
}

/*
 * make_template_string is a thin wrapper around _make_template_string
 *
 * The first parameter is a macro.
 */
export function make_template_string({code, params}, templates, macros) {
  return _make_template_string(parse(code), new Set(params), templates, macros);
}

/*
 * replace_all replaces all occurences of old_s in s with new_s
 */
export function replace_all(s, old_s, new_s) {
  while (s.indexOf(old_s) !== -1) {
    s = s.replace(old_s, new_s);
  }
  return s;
}

/*
 * _expand_macros takes an AST of a MIST expression and returns a string version
 * for a MIST expression with all the macros expanded.
 */
function _expand_macros(node, templates, macros) {
  switch (node.class) {
    case "MIST.Val":
      // Allow 0 parameter macros to be input without parentheses
      if (node.name in templates) {
        return templates[node.name];
      }
      return node.name;
    case "MIST.App":
      const operands = node.operands.map(operand => (
        _expand_macros(operand, templates, macros)
      ));
      if (node.operation in templates) {
        const params = macros[node.operation].params;
        let res = templates[node.operation];
        for (let i = 0; i < operands.length; i++) {
          res = replace_all(res, `{${params[i]}}`, operands[i]);
        }
        return res;
      }
      return `${node.operation}(${operands.join(',')})`;
    default:
      throw TypeError(`Unknown node type ${node.class}`);
  }
}

/*
 * expand_macros takes a MIST string with macros and returns a MIST string with
 * all the macros expanded.
 */
export default function expand_macros(mist_string, macros) {
  const templates = {};
  macros._order.forEach(name => {
    templates[name] = make_template_string(macros[name], templates, macros);
  });
  return _expand_macros(parse(mist_string), templates, macros);
}

// +---------------+-------------------------------------------------
// | Example Usage |
// +---------------+

/*
   const macros = {
     PI: {
       code: "3.14",
       params: []
     },
     E: {
      code: "2.72",
      params: []
     },
     circle: {
       code: "sum(square(wsum(x, dx)), square(wsum(y, dy)))",
       params: ["dx", "dy"]
     },
     circles: {
       code: "wsum(circle(1, 2), circle(3, 4), extra)",
       params: ["extra"]
     },
     _order: ["PI", "E", "circle", "circles"]
   };
   
   expand_macros("avg(circles(wsum(E, PI())))", macros);
   => "avg(wsum(sum(square(wsum(x,1)),square(wsum(y,2))),sum(square(wsum(x,3)),square(wsum(y,4))),wsum(2.72,3.14)))"
   
   expand_macros("quadrants(1, .33, -.33, -1)", {
     quadrants: {
       code: "mistif(x, mistif(y, q4, q1), mistif(y, q3, q2))",
       params: ["q1", "q2", "q3", "q4"]
     },
     _order: ["quadrants"]
   });
   => "mistif(x,mistif(y,-1,1),mistif(y,-.33,.33))"
 */