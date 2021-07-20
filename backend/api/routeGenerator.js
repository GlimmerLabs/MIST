const { handleError } = require("./utilities");
/*
The API looks for actions specified by "funct" or "action" in
either GET or POST requests.  You should pass along the appropriate
object (body or whatever) to the run method, along with the request
and the response objects.  (Yes, the method needs a better name
than "run".)
In most cases, the handlers for the actions are found in
handlers.action (see the section about Handlers).  That way,
we can add another action to the API just by adding another
handler.
*/
const routeGenerator = (handler) => {
	const route = (req, res, next) => {
		let action;
		// Checks for requests to determine which route to use
		// Depending on the type of request (req.method), the specified action will be stored
		// in a different place. (body, query, etc.)
		if (req.method == "GET") {
			action = req.query.action || req.query.funct;
		} else if (
			req.method == "POST" ||
			req.method == "PUT" ||
			req.method == "DELETE"
		) {
			action = req.body.action || req.body.funct;
		}
		if (!action) {
			handleError(res, "No action specified.");
			return;
		}
		if (handler[action]) {
			handler[action](req, res);
		} else {
			handleError(res, `Invalid Action: ${action}`);
		}
	};
	return route;
};
module.exports = routeGenerator;
