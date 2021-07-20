// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Indicate that the operation failed.
 */
const handleError = (res, message) => {
	console.log("FAILED!", message);
	res.status(400).send(message); // "Bad request"
}; // fail

// This implements response in jsend standard https://github.com/omniti-labs/jsend
function dispatchResponse(response, status, statusCode, data, message) {
	switch (status) {
		case "success":
			response.json({
				status: "success",
				data: data,
			});
			break;
		case "fail":
			// statusCode should be in the 400s
			response.status(statusCode).json({
				status: "fail",
				data: data,
			});
			break;
		case "error":
			// statusCode should be in the 500s
			response.status(statusCode).json({
				status: "error",
				message: message,
			});
			break;
		default:
			// We do not expect to be here
			throw Error(`Unknown Status: ${status}`);
	}
}

function dispatchError(response, error) {
	response
		.status(500)
		.json({ status: "error", message: `Server Error: ${error}` });
}

module.exports = {
	handleError,
	dispatchResponse,
	dispatchError,
};
