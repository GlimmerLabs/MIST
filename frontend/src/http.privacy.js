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

import { handleResponseNotOk } from './http.utilities';

/** 
 * Change the privacy state of an item. 
 * 
 * @async 
 * @function changePrivacyState
 * @param {string} itemType, either Album or Image
 * @param {string} itemId, the id of the item's privacy state that we are trying to change
 * @param {boolean} newPrivacyState
 * @returns {Promise<null>}
 */
export async function changeItemPublicState(itemType, itemId, newPrivacyState) {
    const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changeItemPublicState', itemType: itemType, itemId: itemId, newPrivacyState: newPrivacyState })
    });
    if(response.ok){
        const responseJSON = await response.json();
        alert('Successfully changed privacy state.');
    }else{
        handleResponseNotOk(response);
    }
};
