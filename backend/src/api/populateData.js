const pool = require("../db/dbconfig");
const userDB = require("../db/user");
const postDB = require("../db/post");
const routeGenerator = require("./routeGenerator");
const {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} = require("unique-names-generator");
const generator = require("generate-password");

// I don't know the intentions behind the code but in case we need this
// also needs to be converted to sql

var populateDataHandler = {};

/**
 *  Populate the app with randomly generated users.
 *
 */
populateDataHandler.populateUsers = async function (req, res) {
	const random_user_id = uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		separator: "-",
	});
	const user = {
		user_id: random_user_id,
		email: random_user_id + "@example.com",
		password: generator.generate({
			length: 32,
			numbers: true,
			symbols: true,
		}),
		verified: true,
		is_demo_user: true,
		about: "I'm a demo user!",
	};
	// pass the user object to req.body
	req.body.user_id = user.user_id;
	req.body.email = user.email;
	req.body.password = user.password;
	req.body.verified = user.verified;
	req.body.is_demo_user = user.is_demo_user;
	req.body.about = user.about;

	userDB.createUser(req, (message) => {
		if (message === "User created!") {
			res.json(`Demo user created with id: ${user.user_id}`);
		} else {
			console.log(message);
			res.json(`Failed to create demo user with error: ${message}`);
		}
	});
};
/**
 * Populate the app with randomly generated posts.
 * If there's no demo users no images will be generated and it will return an error.
 */
populateDataHandler.populatePosts = async function (req, res) {
	const users = await userDB.getDemoUsers();
	if (!users.length) {
		res.json("No demo users! Generate some demo users first.");
		return;
	}
	var randomUser = users[Math.floor(Math.random() * users.length)];
	req.body.title =
		uniqueNamesGenerator({
			dictionaries: [adjectives],
		}) + " sample";
	req.body.caption = "A generated sample post";
	req.body.code = "wsum(sin(x), cos(y))";
	req.body.user_id = randomUser.user_id;
	req.body.public = true;
	postDB.saveImage(req, (message) => {
		res.json(message);
	});
};
const populateDataRoute = routeGenerator(populateDataHandler);
module.exports = populateDataRoute;
// app.get("/api/profiles/:username", (req, res) => {
// 	const username = req.params.username;
// 	const user = database.User.findOne({ username: username });
// 	//const user = null;
// 	if (user === null) {
// 		user = {
// 			forename: "shrek",
// 			surname: "the ogre",
// 			username: "theShrekster",
// 			createdAt: new Date().toDateString(),
// 			about: "first the worst, shrek the best",
// 			profilepic: "sin(x)",
// 		};
// 	}
// 	const userImages = [
// 		{
// 			id: 0,
// 			title: "image1",
// 			url: "image1",
// 			description: "",
// 			rating: 4,
// 			username: "@shrek",
// 			isAnimated: true,
// 			code: "wsum(sin(x), cos(y))",
// 			comments: "",
// 		},
// 		{
// 			id: 1,
// 			title: "image2",
// 			url: "image2",
// 			description: "",
// 			rating: 10,
// 			username: "@shrek",
// 			isAnimated: false,
// 			code: "cos(x)",
// 			comments: "",
// 		},
// 		{
// 			id: 2,
// 			title: "image3",
// 			url: "image3",
// 			rating: 10,
// 			username: "@shrek",
// 			isAnimated: true,
// 			code: "mult(cos(y),y)",
// 			comments: "",
// 		},
// 	];
// 	const userAlbums = [
// 		{
// 			name: "my images",
// 			images: userImages,
// 			createdAt: new Date().toDateString(),
// 			caption: "best album ever",
// 		},
// 		{
// 			name: "my favorites",
// 			images: userImages,
// 			createdAt: new Date().toDateString(),
// 			caption: "my favorite images to date",
// 		},
// 	];
// 	const userInfo = {
// 		user: user,
// 		userImages: userImages,
// 		userAlbums: userAlbums,
// 	};
// 	res.json(userInfo);
// });
// // provides user information needed for profile page
// // trying to match the userSchema,
// // but only choose the ones we are using currently for the profile
// app.get("/api/profile", (req, res) => {
// 	var user = {
// 		forename: "shrek",
// 		surname: "the ogre",
// 		username: "theShrekster",
// 		createdAt: new Date().toDateString(),
// 		about: "first the worst, shrek the best",
// 		profilepic: "sin(x)",
// 	};
// 	var userImages = [
// 		{
// 			id: 0,
// 			title: "image1",
// 			url: "image1",
// 			description: "",
// 			rating: 4,
// 			username: "@shrek",
// 			isAnimated: true,
// 			code: "wsum(sin(x), cos(y))",
// 			comments: "",
// 		},
// 		{
// 			id: 1,
// 			title: "image2",
// 			url: "image2",
// 			description: "",
// 			rating: 10,
// 			username: "@shrek",
// 			isAnimated: false,
// 			code: "cos(x)",
// 			comments: "",
// 		},
// 		{
// 			id: 2,
// 			title: "image3",
// 			url: "image3",
// 			rating: 10,
// 			username: "@shrek",
// 			isAnimated: true,
// 			code: "mult(cos(y),y)",
// 			comments: "",
// 		},
// 	];
// 	var userAlbums = [
// 		{
// 			name: "my images",
// 			images: userImages,
// 			createdAt: new Date().toDateString(),
// 			caption: "best album ever",
// 		},
// 		{
// 			name: "my favorites",
// 			images: userImages,
// 			createdAt: new Date().toDateString(),
// 			caption: "my favorite images to date",
// 		},
// 	];
// 	var userInfo = {
// 		user: user,
// 		userImages: userImages,
// 		userAlbums: userAlbums,
// 	};
// 	res.json(userInfo);
// });
