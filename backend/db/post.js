const pool = require("./dbconfig"); // Used for database queries

// +------------+-------------------------------------------------
// |   Images   |
// +------------+

// Determines if a user exists, given their username (user_id)
// Returns a boolean value
const user_column = "user_id";
const checkUserExists = async (column, value) => {
	const result = await pool.query(
		`select exists (select 1 from users where ${column} = $1)`,
		[value]
	);
	return result.rows[0].exists;
};

/**
 * checks whether the user owns an image with the same title
 * @param user_id the username of the user
 * @param title the title of the image
 * @param callback sends the error if there is one, true
 * if the image exists, and false if it does not
 */
const imageExists = async (user_id, title, callback) => {
	if (!(await checkUserExists(user_column, user_id))) {
		callback("User ID does not exist!");
	}

	return pool
		.query(
			"select exists (select * from posts where (user_id=$1 and title=$2))",
			[user_id, title]
		)
		.then((res) => {
			return res.rows[0].exists;
		})
		.catch((err) => {
			console.log(err);
			throw err;
			return;
		});
};

const collectionExists = async (user_id, title, callback) => {
	if (!(await checkUserExists(user_column, user_id))) {
		callback("User ID does not exist!");
	}

	return pool.query(
		"select exists (select * from collections where (user_id=$1 and title=$2))",
		[user_id, title]
	);
};

/**
 * saves the new image in the database
 * @param title title of the image
 * @param caption caption of the image (optional)
 * @param code code for the image
 * @param user_id the username of the user
 * @param visibility visibility of the image (true if public, false if private)
 * @param callback sends the error if there is one, true
 * if the image exists, and false if it does not
 */

//TODO: if image already is saved, override it?
const saveImage = async (req, callback) => {
	if (await imageExists(req.body.user_id, req.body.title, callback)) {
		callback("Image already exists!");
		return;
	}

	return pool
		.query(
			"insert into posts (title, caption, code, user_id, public) \
        values ($1, $2, $3, $4, $5)",
			[
				req.body.title,
				req.body.caption,
				req.body.code,
				req.body.user_id,
				req.body.public,
			]
		)
		.then((res) => {
			callback(`Image ${req.body.title} has been created`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};
module.exports = {
	imageExists,
	collectionExists,
	saveImage,
};
