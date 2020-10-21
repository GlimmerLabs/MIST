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

/*
 * This is response handling following JSend Specifications.
 */

module.exports = {
    checkAuthentication,
    dispatchResponse,
    dispatchError
}

/**
 * 
 * @param {Request} request 
 * @param {Response} response 
 * @param {function} next 
 */
// https://stackoverflow.com/questions/38820251/how-is-req-isauthenticated-in-passport-js-implemented
function checkAuthentication (request, response, next) {
  if (request.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    // This is the jsend response status for rejected API call
    const responseStatus = "fail";
    // This is the unauthorized/unauthenticated HTTP response status code
    const responseStatusCode = 401;
    const data = { "Authentication": "You need to be logged in!" };
    dispatchResponse(response, responseStatus, responseStatusCode, data);
  };
};

/**
 * 
 * @param {Response} response 
 * @param {string} status 
 * @param {number} statusCode 
 * @param {Object} data 
 * @param {string} message 
 */
// This implements response in jsend standard https://github.com/omniti-labs/jsend
function dispatchResponse (response, status, statusCode, data, message){
  switch(status){
    case "success":
      response.json({
        "status": "success",
        "data": data
      });
      break;
    case "fail":
      // statusCode should be in the 400s
      response.status(statusCode).json({
        "status": "fail",
        "data": data
      })
      break;
    case "error":
      // statusCode should be in the 500s
      response.status(statusCode).json({
        "status": "error",
        "message": message,
      })
      break;
    default:
      // We do not expect to be here
      throw Error(`Unknown Status: ${status}`);
  }
}

/**
 * 
 * @param {Response} response 
 * @param {Error} error 
 */
function dispatchError(response, error){
  response.status(500).json({ "status": "error", "message": `Server Error: ${error}`});
}