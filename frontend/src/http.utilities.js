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

 
/* +-------+
 * | Notes |
 * +-------+
 * 
 * Documentation following JSDocs https://jsdoc.app/index.html
 * Functions here are utility to http functions. 
 */
// UTILITIES
// statusCode may be redundant information

// responds to response not ok
export async function handleResponseNotOk(response) {
    const {data, message, status} = await response.json();
    const statusCode = response.status;
    switch (status) {
        case "fail":
            const failureMessage = `Status Code: ${statusCode}. Failed due to: ${objectToPrettyString(data)}`;
            console.log(failureMessage);
            alert(failureMessage);
            throw(Error(failureMessage));
            break;
        case "error":
            const errorMessage = `Status Code: ${statusCode}. Failed due to: ${objectToPrettyString(message)}`;
            console.log(errorMessage);
            alert(errorMessage);
            throw(Error(errorMessage));
            break;
        default:
            // we do not expect to reach this case
            throw Error(`Unknown Status: ${status}`);
    }
};

function objectToPrettyString(object) {
    let str = '';
    for (const property in object) {
        str = str + (`${property}: ${object[property]}\n`);
    }
    return str;
};
