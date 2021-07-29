const routeGenerator = require("./routeGenerator");

var galleryHandlers = {};
// +----------------+--------------------------------------------------
// | Gallery        |
// +----------------+
/**
 *   Get featured images for home pages
 *   info.action: getHomeImages
 */

galleryHandlers.getHomeImages = function (info, req, res) {
	database.getFeaturedImagesLoggedOut(4, (images, error) => {
		if (error) {
			console.log(error);
			res.json([]);
		} else if (!images) res.json([]);
		else res.json(images);
	});
};

/**
 *   Get 9 random public images
 *   info.action: getRandomImages
 */
galleryHandlers.getRandomImages = function (info, req, res) {
	let loginStatus = false;
	if (req.isAuthenticated()) loginStatus = true;

	if (loginStatus) {
		// if the user is logged in, show them non-blocked images made from non-blocked users
		database.getRandomImagesLoggedIn(req.user._id, 9, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	} else {
		// if the user is not logged in, show everything
		database.getRandomImagesLoggedOut(9, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	}
};

/**
 *   Get 9 top public images
 *   info.action: getTopImages
 */
galleryHandlers.getTopImages = function (info, req, res) {
	let loginStatus = false;
	if (req.isAuthenticated()) loginStatus = true;

	if (loginStatus) {
		// if the user is logged in, show them non-blocked images made from non-blocked users
		database.getTopRatedLoggedIn(req.user._id, 9, 1, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	} else {
		// if the user is not logged in, show everything
		database.getTopRatedLoggedOut(9, 1, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	}
};

/**
 *   Get 9 featured public images
 *   info.action: getFeaturedImages
 */
galleryHandlers.getFeaturedImages = function (info, req, res) {
	let loginStatus = false;
	if (req.isAuthenticated()) loginStatus = true;

	if (loginStatus) {
		// if the user is logged in, show them non-blocked images made from non-blocked users
		database.getFeaturedImagesLoggedIn(req.user._id, 9, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	} else {
		// if the user is not logged in, show everything
		database.getFeaturedImagesLoggedOut(9, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	}
};

/**
 *   Get 9 recent public images
 *   info.action: getPopularImages
 */
galleryHandlers.getRecentImages = function (info, req, res) {
	let loginStatus = false;
	if (req.isAuthenticated()) loginStatus = true;

	if (loginStatus) {
		// if the user is logged in, show them non-blocked images made from non-blocked users
		database.getRecentImagesLoggedIn(req.user._id, 9, 1, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	} else {
		// if the user is not logged in, show everything
		database.getRecentImagesLoggedOut(9, 1, (images, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!images) res.json([]);
			else res.json(images);
		});
	}
};

const galleryRoute = routeGenerator(galleryHandlers);
module.exports = galleryRoute;
