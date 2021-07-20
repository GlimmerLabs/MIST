const routeGenerator = require("./routeGenerator");
// +----------+----------------------------------------------------------
// | Reporting/Hiding/Blocking |
// +---------------------------+


var reportHandlers = {};
/**
 * Info contains the type of content that the user wants to hide as way as the
 * ObjectId of the content in the database.
 * info = {
 *  type: STRING,
 *  contentid: STRING,
 * }
 */
reportHandlers.hideContent = async function (info, req, res) {
	if (!req.isAuthenticated())
		fail(res, "You need to be logged in to hide content!");
	else {
		try {
			const userid = req.user._id;
			const { type, contentid } = info;
			const success = await database.hideContent(userid, type, contentid);
			res.json({
				success: success,
				message: success
					? "Successfully hidden content!"
					: "Failed to hide content due to unknown reason",
			});
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

/**
 * Info contains the type of content that the user wants to unhide as way as the
 * ObjectId of the content in the database.
 * info = {
 *  type: STRING,
 *  contentid: STRING,
 * }
 */
reportHandlers.unhideContent = async function (info, req, res) {
	if (!req.isAuthenticated())
		fail(res, "You need to be logged in to hide content!");
	else {
		try {
			const userid = req.user._id;
			const { type, contentid } = info;
			const success = await database.unhideContent(userid, type, contentid);
			res.json({
				success: success,
				message: success
					? "Successfully hidden content!"
					: "Failed to hide content due to unknown reason",
			});
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

/*
 * Return whether the user is blocked
 * info.action: getBlockedStatus
 * info = {
 *  blockedid: STRING,
 * }
 */
reportHandlers.getBlockedStatus = function (info, req, res) {
	if (!req.user) res.json(null);
	else {
		database.isBlocked(req.user._id, info.blockedid, (status) => {
			res.json(status);
		});
	}
};

/*
 * Block the user('blockedid') for the current user
 * info.action: blockUser
 * info = {
 *  blockedid: STRING,
 * }
 */
reportHandlers.blockUser = function (info, req, res) {
	if (!req.isAuthenticated()) throw "You have to be logged in to block a user";
	else
		database.blockUser(req.user._id, req.body.blockedid, (message) =>
			res.json(message)
		);
};

/*
 * Unblock the user('contentid') for the current user
 * info.action: blockUser
 * info = {
 *  contentid: STRING,
 * }
 */
reportHandlers.unblockUser = async function (info, req, res) {
	if (!req.isAuthenticated())
		res.json({
			success: false,
			message: "You have to be logged in to unblock a user",
		});
	else {
		try {
			const { userid, contentid } = info;
			const success = await database.unblockUser(userid, contentid);
			res.json({
				success: success,
				message: success
					? "Successfully unblocked a user"
					: "Failed to unblock user due to unknown error",
			});
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

const reportRoute = routeGenerator(reportHandlers);
module.exports = reportRoute;
