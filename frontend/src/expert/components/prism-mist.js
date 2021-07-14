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

import { highlight as prism_highlight } from 'prismjs/components/prism-core';

// A UTF character that doesn't take up any width, used for matching parentheses
const invisible_char = "‎";

const mist = {
  'keyword': {
    'pattern': /(^|,|\s|\(|‎)(?:abs|avg|cos|mistif|mult|neg|rgb|sign|signz|sin|sine|square|sum|wsum|wdiv|div|sqrt|tan|atan)(?=\(|\s|‎)/,
    'lookbehind': true
  },
  'number': {
    'pattern': /(,|\s|\(|‎)-?[0-9]?\.?[0-9]+/,
    'lookbehind': true
  },
  'paren': {
    'pattern': new RegExp("(" + invisible_char + ")(?:\\(|\\))(?=" + invisible_char + ")"),
    'lookbehind': true
  },
  'symbol': {
    'pattern': /(\(|,|\s|‎)(?:x|y|t\.(?:s|m|h|d)|m\.(?:x|y))(?=\s|,|\)|‎)/,
    'lookbehind': true
  }
};

export function match_macros(macros_list) {
  macros_list = macros_list.filter(macro => macro !== "");
  if (macros_list.length > 0) {
    mist.macros = macros_list.map(macro => ({
      'pattern': new RegExp(`(^|${invisible_char}|\\(|,|\\s)(?:${macro})(?=\\s|,|\\)|\\(|${invisible_char})`),
      'lookbehind': true
    }));
  } else {
    mist.macros = undefined;
  }
}

export function match_params(params_list) {
  params_list = params_list.filter(param => param !== "");
  if (params_list.length > 0) {
    mist.params = params_list.map(param => ({
      'pattern': new RegExp(`(${invisible_char}|\\(|,|\\s)(?:${param})(?=\\s|,|${invisible_char}|\\))`),
      'lookbehind': true
    }));
  } else {
    mist.params = undefined;
  }
}

export function highlight(code, textareaId) {
  const textarea = document.getElementById(textareaId);
  let start = textarea?.selectionStart ?? -1;
  if (start === -1 || (code[start] !== '(' && code[start] !== ')')) {
    return prism_highlight(code, mist, 'mist');
  }

  code = Array.from(code);
  let end = null;

  // The cursor is by an open paren
  if (code[start] === '(') {
    let parens = 1;
    let i = start + 1;
    while (parens > 0 && i < code.length) {
      switch (code[i++]) {
        case '(': parens++; break;
        case ')': parens--; break;
        default: break;
      }
    }
    if (parens === 0) {
      end = i - 1;
    }
  } // The cursor is by an open paren
  // Otherwise, the cursor is by a closed paren
  else {
    end = start;
    start = null;
    let parens = 1;
    let i = end - 1;
    while (parens > 0 && i >= 0) {
      switch (code[i--]) {
        case '(': parens--; break;
        case ')': parens++; break;
        default: break;
      }
    }
    if (parens === 0) {
      start = i + 1;
    }
  }

  if (end !== null && start !== null) {
    code.splice(end, 1, invisible_char, code[end], invisible_char);
    code.splice(start, 1, invisible_char, code[start], invisible_char);
  }
  return prism_highlight(code.join(''), mist, 'mist');
}