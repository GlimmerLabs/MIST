const postDB = require("../db/post.js");
const commentDB = require("../db/comments.js");
const routeGenerator = require("./routeGenerator");

// +------------------+--------------------------------------------------
// | Posts            |
// +------------------+

var postHandlers = {};

/**
 * Check if an image exists (should be imagetitleexists)
 *   info.action: imageexists
 *   info.title: The title of the image
 */
postHandlers.imageExists = function (info, req, res) {
	const next = () => {
		database.imageExists(req.user.username, info.title, (err, response) => {
			if (err) {
				const errorMessage = `Unable to save image due to server error: ${err}`;
				dispatchResponse(res, "error", 500, undefined, errorMessage);
			} else {
				dispatchResponse(res, "success", undefined, {
					exists: Boolean(response),
				});
			}
		});
	};
	checkAuthentication(req, res, next);
};

/**
 * Save an image to the database
 *   info.action: saveimage
 *   info.title: The title of the image
 */
postHandlers.saveImage = async function (req, res) {
	var message = "";
	if (!req.isAuthenticated()) {
		message = "You must be logged in to save an image!";
		res.json(message);
	} else {
		try {
			const success = await postDB.saveImage(req, (mes) => {
				message = mes;
			});
			res.json(message);
		} catch (error) {
			res.json("Error occurred while awaiting saveImage query");
		}
	}
};

// +----------------+--------------------------------------------------
// | Comments       |
// +----------------+

/**
 *   Post a comment on an image
 *   info.action: postComment
 */

postHandlers.postComment = function (req, res) {
	commentDB.saveComment(req, res);
};

/**
 *  Get all comments on an image
 *  info.action = getComments
 */

postHandlers.getImageComments = function (req, res) {
	let retrievedComments = commentDB.getComments(req, (message) => {
		res.json(message);
	});

	if (req.isAuthenticated()) {
		let blockedUsers = reportDB.getBlockedUsers(req, (message) => {
			res.json(message);
		});
		retrievedComments.forEach((comment) => {
			blockedUsers.forEach((blocked_user) => {
				if (blockedUsers.user_id === comment.user_id) {
					comment.contents = "**BLOCKED**"; //marking as blocked - may be a better way
				}
			});
		});
	} else {
	}

	return retrievedComments.rows;
};

const postRoute = routeGenerator(postHandlers);
module.exports = postRoute;
