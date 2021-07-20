const { verifyEmail } = require("./db/user");
const collectionRoute = require("./api/collection");
const populateDataRoute = require("./api/populateData");
const galleryRoute = require("./api/gallery");
const userRoute = require("./api/user");
const postRoute = require("./api/post");
const reportRoute = require("./api/report");
const workspaceRoute = require("./api/workspace");

module.exports = (app) => {
	app.use("/api/collections", collectionRoute);
	app.use("/api/populateData", populateDataRoute);
	app.use("/api/galleries", galleryRoute);
	app.use("/api/posts", postRoute);
	app.use("/api/reports", reportRoute);
	app.use("/api/users", userRoute);
	app.use("/api/workspaces", workspaceRoute);

	/*
		Email Verification Route
		Runs when user clicks the link sent to their email
		The user's token is sent to verifyEmail and checked
	*/
	app.get("/emailVerification/:token", (req, res) => {
		verifyEmail(req, (message) => {
			if (message == "Email Verified") {
				console.log("Email verification success!");
				res.json(message);
			} else {
				console.error(message);
				res.json(message);
			}
		});
	});
};
