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

// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * This file contains important global constants for our Expert UI.
 * These are MIST_builtin_functions for default-builtin MIST functions and  
 * MIST_builtin_values for default-builtin MIST values.
 */

export const MIST_builtin_functions = {
    "abs": {
        "class": "MIST.FunInfo",
        "name": "abs",
        "display": "abs",
        "about": "The absolute value of i",
        "params": "i",
        "minarity": 1,
        "maxarity": 1,
        "type": "GENERAL"
    },
    "avg": {
        "class": "MIST.FunInfo",
        "name": "average",
        "display": "avg",
        "about": "Average 2 or more values",
        "params": "...",
        "minarity": 2,
        "maxarity": 20,
        "type": "GENERAL"
    },
    "cos": {
        "class": "MIST.FunInfo",
        "name": "cosine",
        "display": "cos",
        "about": "The cosine of pi*a",
        "params": "a",
        "minarity": 1,
        "maxarity": 1,
        "type": "GENERAL"
    },
    "mult": {
        "class": "MIST.FunInfo",
        "name": "multiply",
        "display": "mult",
        "about": "Multiply 2 or more values",
        "params": "...",
        "minarity": 2,
        "maxarity": 20,
        "type": "GENERAL"
    },
    "neg": {
        "class": "MIST.FunInfo",
        "name": "negate",
        "display": "neg",
        "about": "negates value",
        "params": "a",
    },
    "rgb": {
        "class": "MIST.FunInfo",
        "name": "rgb",
        "display": "rgb",
        "about": "Generate an RGB color from red, green, and blue components",
        "params": "r,g,b",
        "minarity": 3,
        "maxarity": 3,
        "type": "RGB"
    },
    "sign": {
        "class": "MIST.FunInfo",
        "name": "sign",
        "display": "sign",
        "about": "If i < 0, returns -1; if i >- 0, returns 1",
        "params": "i",
        "minarity": 1,
        "maxarity": 1,
        "type": "GENERAL"
    },
    "signz": {
        "class": "MIST.FunInfo",
        "name": "signz",
        "display": "signz",
        "about": "If i < 0, returns -1; if i > 0, returns 1; if i is 0, returns 1.",
        "params": "i",
        "minarity": 1,
        "maxarity": 1,
        "type": "GENERAL"
    },
    "sin": {
        "class": "MIST.FunInfo",
        "name": "sine",
        "display": "sin",
        "about": "The sine of pi*a",
        "params": "a",
        "minarity": 1,
        "maxarity": 1,
        "type": "GENERAL"
    },
    "square": {
        "class": "MIST.FunInfo",
        "name": "square",
        "display": "square",
        "about": "Square i",
        "params": "i",
        "minarity": 1,
        "maxarity": 1,
        "type": "GENERAL"
    },
    "sum": {
        "class": "MIST.FunInfo",
        "name": "sum",
        "display": "sum",
        "about": "Sum 2 or more values.  If the sum would exceed 1, has the value 1.  If the sum would be less than -1, has the value -1",
        "params": "...",
        "minarity": 2,
        "maxarity": 20,
        "type": "GENERAL"
    },
    "wsum": {
        "class": "MIST.FunInfo",
        "name": "wrapsum",
        "display": "wsum",
        "about": "Sum 2 or more values, wrapping around from 1 to -1 (or vice versa) if the sum is too large or too small",
        "params": "...",
        "minarity": 2,
        "maxarity": 20,
        "type": "GENERAL"
    },
    "mistif": {
        "class": "MIST.FunInfo",
        "name": "mistif",
        "display": "mistif",
        "about": "if test is greater than or equal to zero, return pos, if test is less than zero, return neg",
        "params": "test, pos, neg",
        "minarity": 3,
        "maxarity": 3,
        "type": "GENERAL"
    },
}


export const MIST_builtin_values = {
    "x": {
        "name": "x",
        "about": "ranges from -1 to 1 basesd on the x-value"
    },
    "y": {
        "name": "y",
        "about": "ranges from -1 to 1 basesd on the y-value"
    },
    "second": {
        "name": "t.s",
        "about": "goes through values -1 to 1 every second"
    },
    "minute": {
        "name": "t.m",
        "about": "goes through values -1 to 1 every minute"
    },
    "hour": {
        "name": "t.h",
        "about": "goes through values -1 to 1 every hour"
    },
    "day": {
        "name": "t.d",
        "about": "goes through values -1 to 1 every day"
    },
    "mouseX": {
        "name": "m.x",
        "about": "takes the x-value of the position of the mouse on the image"
    },
    "mouseY": {
        "name": "m.y",
        "about": "takes the y-value of the position of the mouse on the image"
    },
    "constant": {
        "name": "#",
        "about": "enter your own number"
    },

};
