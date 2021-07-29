const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing
const { passwordStrength } = require("check-password-strength");
// https://www.npmjs.com/package/check-password-strength

// +------------+-------------------------------------------------
// |    Users   |
// +------------+

/**
 * Checks if the password is secure enough when the user is signing up
 */
const user_column = "user_id";
const email_column = "email";

// Determines if a user exists, given their username (user_id)
// Returns a boolean value
const checkUserExists = async (column, value) => {
	return pool
		.query(`select exists (select 1 from users where ${column} = $1)`, [value])
		.then((res) => {
			return res.rows[0].exists;
		})
		.catch((err) => {
			handleDBError(err, (_) => {});
			throw err;
		});
};

// CREATE
/**
 * creates a new user in the database
 * @param req the request, must contain a user object
 * with user_id, email, password
 * @param callback returns if the user exists already or if the user was created succesfully
 */
module.exports.createUser = async (req, callback) => {
	let user = req.body;
	// check user ID duplicate
	if (await checkUserExists(user_column, user.user_id)) {
		console.log("User Exists");
		callback("User ID Already taken.");
		return;
	}
	// check email duplicate
	if (await checkUserExists(email_column, user.email)) {
		callback("Email already registered.");
		return;
	}

	const passwdStrength = passwordStrength(user.password);
	// 0 = Too weak
	// 1 = Weak
	// 2 = Medium
	// 3 = Strong
	if (passwdStrength.id < 1) {
		callback("Password too weak. Try a stronger password.");
		return;
	}
	const hashedPassword = await bcrypt.hash(user.password, 12); // Hashes password
	return pool
		.query(
			"insert into users (user_id, email, password, token, is_demo_user) \
        values($1, $2, $3, $4, $5)",
			[user.user_id, user.email, hashedPassword, user.token, user.is_demo_user]
		)
		.then((res) => {
			callback(`User created!`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};

// READ
/**
 *
 * Check if user's email is verified
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.checkEmailVerified = async (req, callback) => {
	const user = req.body;
	if (!(await checkUserExists(user_column, user.user_id))) {
		callback("User ID does not exist!");
		return false;
	}
	return pool
		.query("select verified from users where user_id=$1", [user.user_id])
		.then((res) => {
			return res.rows[0].verified;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};
module.exports.getDemoUsers = async () => {
	return pool
		.query("select * from users where is_demo_user=true")
		.then((res) => {
			return res.rows;
		})
		.catch((err) => {
			console.log(err);
			return;
		});
};

// UPDATE

/**
 *
 * Verify the email by looking up the token.
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.verifyEmail = async (req, callback) => {
	const user = req.body;
	return pool
		.query(
			"update users set verified=true where token=$1", // If token matches, set user to verified
			[req.params.token]
		)
		.then((res) => {
			callback(`Email verified`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};
/**
 * Changes the password of the user
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.changePassword = async (req, callback) => {
	const user = req.body;
	let dbPassword = "";
	return pool
		.query("select password from users where user_id=$1", [user.user_id])
		.then((res) => {
			bcrypt.compare(user.currentPassword, dbPassword, async (err, result) => {
				// compare the hash with the given password
				if (err) {
					callback(err);
				}
				if (result === false) {
					callback("Old Password Does Not Match");
				} else {
					const passwdStrength = passwordStrength(user.newPassword);
					// 0 = Too weak
					// 1 = Weak
					// 2 = Medium
					// 3 = Strong
					if (passwdStrength.id < 1) {
						callback("Weak password. Try a stronger password.");
						return;
					}
					let newPass = await bcrypt.hash(user.newPassword, 12); // hashes new password
					return pool
						.query("update users set password=$1 where user_id=$2", [
							newPass,
							user.user_id,
						])
						.then((res) => {
							callback(
								`Successfully updated password for user: ${user.user_id}`
							);
						})
						.catch((err) => {
							handleDBError(err, callback);
							return;
						});
				}
			});
			dbPassword = res.rows[0].password;
		})
		.catch((err) => {
			handleDBError(err, callback);
		});
};

/**
 * Changes the email of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the email was successfully updated or an error occurred
 */
module.exports.changeEmail = (req, callback) => {
	let user = req.body;
	return pool
		.query("update users set email=$1 where user_id=$2", [
			user.email,
			user.user_id,
		])
		.then((res) => {
			callback(`Successfully updated email for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};

/**
 * Changes the username of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the username is taken, was successfully updated, or an error occurred
 */
module.exports.changeUserId = async (req, callback) => {
	const user = req.body;
	if (user.new_user_id === "") callback("Username cannot be blank");
	else {
		if (await checkUserExists(user_column, user.new_user_id)) {
			// Checks if the username is already in use
			console.log("Duplicate User ID");
			callback("User ID already in use!");
		} else {
			return pool
				.query("update users set user_id=$1 where user_id=$2", [
					user.new_user_id,
					user.user_id,
				])
				.then((res) => {
					callback("User ID updated successfully.");
				})
				.catch((err) => {
					handleDBError(err, callback);
					throw err;
				});
		}
	}
};

/**
 * Changes the bio of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the bio was successfully updated or an error occurred
 */
module.exports.changeAbout = async (req, callback) => {
	let user = req.body;
	if (!(await checkUserExists(user_column, user.user_id))) {
		callback("User does not exist.");
		return;
	}
	return pool
		.query("update users set about = '$1' where user_id = '$2'", [
			user.newBio,
			user.user_id,
		])
		.then((res) => {
			callback(`Updated about description for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};
/**
 *
 * @param {*} req
 * @param {*} callback
 * Changes the profile picture of the user in the database
 * Returns a message if the profile picture was succesfully updated or an error occured
 */
module.exports.changeProfilePic = async (req, callback) => {
	let user = req.body;
	let user_exists;
	if (!(await checkUserExists(user_column, user.user_id))) {
		callback("User does not exist.");
		return;
	}
	return pool
		.query("update users set profile_pic = $1 where user_id = $2", [
			user.newProfilePic,
			user.user_id,
		])
		.then((res) => {
			callback(`Updated profile picture for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};

// DELETE
/**
 *
 * Deletes the user's account
 * @param {*} req
 * @param {*} callback
 */

module.exports.deleteAccount = async (req, callback) => {
	let user = req.body;
	let dbPassword = "";
	if (!(await checkUserExists(user_column, user.user_id))) {
		callback("User does not exist.");
		return;
	}
	return pool
		.query("select password from users where user_id=$1", [user.user_id])
		.then((res) => {
			dbPassword = res.rows[0].password;
			bcrypt.compare(user.password, dbPassword, async (err, result) => {
				// checks password before deleting
				if (err) {
					console.log(err);
				}
				if (result === false) {
					callback("Password incorrect.");
				} else {
					return pool
						.query("delete from users where user_id=$1", [user.user_id])
						.then((res) => {
							callback("Deleted user.");
						})
						.catch((err) => {
							handleDBError(err, callback);
							throw err;
						});
				}
			});
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};

// Returns all images for the user's own profile
// TODO: have it check for user_id so it can be used for personal profile and other profiles
// 		  (only difference is other profiles only retrieve public images)
module.exports.getCompleteUserProfile = async (req, callback) => {
	let user = req.body;
	return pool
		.query("select exists (select 1 from users where user_id=$1)", [
			user.user_id,
		])
		.then((res) => {
			if (res.rows[0].exists) {
				callback("User does not exist.");
			}
			pool
				.query(
					"select code, created_at, likes, comments from posts \
		inner join users on posts.user_id = users.user_id \
		where user_id = $1",
					[user.user_id]
				)
				.then((res) => {
					return res.rows[0]; //return the user object
				})
				.catch((err) => {
					handleDBError(err, callback);
					throw err;
				});
		})
		.catch((err) => {
			handleDBError(err, callback);
			throw err;
		});
};

// TODO In the future, parse the error code.
const handleDBError = (err, callback) => {
	console.error(err);
	callback("Unknown Database error.");
	return;
};
// //https://www.reddit.com/r/node/comments/ku7rji/is_there_a_better_way_to_handle_postgres_database/giqvi3h?utm_source=share&utm_medium=web2x&context=3
// const handleDBError = (err, callback) => {
// 	console.error(err);
// 	const errors = {
// 		UniqueViolationError: {
// 			code: 23505,
// 			message: (field) => `${field} already exists.`,
// 		},
// 	};
// 	if (err.code === errors.UniqueViolationError.code) {
// 		callback(errors.UniqueViolationError.message(err.internalQuery));
// 		return;
// 	}
// 	callback(message);
// };
