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
/**
 * 2020-07-24 Version 1.0
 * 
 * Here we have two constants where we store the initial state of the function form
 * and the initial state of the Popup Modal. These objects should be readOnly. Thus,
 * we only export getter functions which return objects with the same key-value
 * assignments.
 */

/**
 * The initial state of the function form
 */
const initialForm = {
    code: "",
    default_params: "",
    description: "",
    message: "",
    name: "",
    params: "",
}

const initialMacros = {
    _order: [],
}

/** 
 * The initial state of the Popup
 */
const initialPopup = {
    isOpen: false,
    message: 'STUB',
    onConfirm: () => { console.log('STUB') },
}


/**
 * This returns an object identical to initialForm
 */
export function getInitialForm() {
    return {
        ...initialForm
    }
} // getInitialForm()

/**
 * This returns an object identical to initialMacros
 */
export function getInitialMacros() {
    return {
        ...initialMacros
    }
}

/**
 * This returns an object identical to initialPopup
 */
export function getInitialPopup() {
    return {
        ...initialPopup,
    }
}

/**
 * This returns an object that represents the intended initial state of
 * the Expert Component.
 */
export function getInitialState() {
    return {
        form: {
            ...initialForm,
        },
        functions: {
            _order: [],
        },
        popup: {
            ...initialPopup,
        }
    }
} // getInitialState()
