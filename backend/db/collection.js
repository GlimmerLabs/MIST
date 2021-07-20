const pool = require("./dbconfig"); // Used for database queries

// +--------+----------------------------------------------------------
// | Collection |
// +--------+

/**
 * Checks if the password is secure enough when the user is signing up
 */
 const user_column = "user_id";
 
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

// create Collection
module.exports.createCollection = async (req, callback) => {
  pool.query("insert into collections (user_id, title, caption, collection_id) \
values ($1, $2, $3, $4)",
    [req.body.user_id, req.body.title, req.body.caption, collection_id]
)
    .then((res) => {
      callback(`Collection has been created`);
  })
  .catch((err) => {
      handleDBError(err, callback);
      return;
  });

 }
  
  /**
  * deletes a collection
  * DANGEROUS DOES NOT CHECK FOR AUTHORIZATION
  * @param userId: the object ID for the user
  * @param albumId: the object ID for the album
  */
  module.exports.deleteCollection = async (req, callback) => {
    pool
      .query("delete from collections where (user_id=$1 and title=$2)"
        [req.body.user_id, req.bod.title]
      )

      .then((res) => {
          callback(`Collection has been deleted`);
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      });
  }
  
  
/**
 * Adds an image to a collection
 * @param {String} albumId
 * @param {String} imageId
 */
module.exports.addToCollection = async (req, callback) => {
	let post_id = 0;
	let collection_id = 0;

	if (
		!(await collectionExists(
			req.body.user_id,
			req.body.collection_title,
			callback
		))
	) {
		callback("Collection does not exist!");
		return;
	}
	if (
		!(await imageExists(req.body.image_author, req.body.image_title, callback))
	) {
		callback("Image does not exist!");
		return;
	}

	pool
		.query("select post_id from posts where (user_id=$1 and title=$2)", [
			req.body.image_author,
			req.body.image_title,
		])
		.then((res) => {
			post_id = res.rows[0].post_id;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	pool
		.query(
			"select collection_id from collections where (user_id=$1 and title=$2)",
			[req.body.user_id, req.body.collection_title]
		)
		.then((res) => {
			collection_id = res.rows[0].collection_id;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	pool
		.query(
			"insert into collection_images (post_id, collection_id) values ($1, $2)",
			[post_id, collection_id]
		)
		.then((res) => {
			callback("Image inserted into collection successfully!");
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};



  // remove image from collection
  module.exports.removeFromCollection = async (imageId, albumId) => {
    let post_id = 0;
	let collection_id = 0;

	if (
		!(await collectionExists(
			req.body.user_id,
			req.body.collection_title,
			callback
		))
	) {
		callback("Collection does not exist!");
		return;
	}
	if (
		!(await imageExists(req.body.image_author, req.body.image_title, callback))
	) {
		callback("Image does not exist!");
		return;
	}

	pool
		.query("select post_id from posts where (user_id=$1 and title=$2)", [
			req.body.image_author,
			req.body.image_title,
		])
		.then((res) => {
			post_id = res.rows[0].post_id;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	pool
		.query(
			"select collection_id from collections where (user_id=$1 and title=$2)",
			[req.body.user_id, req.body.collection_title]
		)
		.then((res) => {
			collection_id = res.rows[0].collection_id;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	pool
		.query(
			"insert into collection_images (post_id, collection_id) values ($1, $2)",
			[post_id, collection_id]
		)
		.then((res) => {
			callback("Image inserted into collection successfully!");
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
  }

const collectionExists = async (user_id, title, callback) => {
    if (!(await checkUserExists(user_column, user_id))) {
          callback("User ID does not exist!");
      }
      
    pool
		.query("select exists (select * from collections where (user_id=$1 and title=$2))",
                      [user_id, title]
		)
		.then((res) => {
			return res.rows[0].exists;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

 // rename a collection
 module.exports.renameCollection = async (req, callback) => {
    if (!(await collectionExists(req.body.user_id, req.body.current_title, callback))) {
        callback("Collection does not exist!");
        return;
    }

    pool.query("update collections set title=$1 where (user_id=$2 and title=$3)",
                [new_title, user_id, current_title]);
  };
  
  // change an album's caption
  module.exports.changeAlbumCaption = async (req, callback) => {
    if (!(await collectionExists(req.body.user_id, req.body.title, callback))) {
        callback("Collection does not exist!");
        return;
    }

    pool
		.query("update collections set caption=$1 where (user_id=$2 and title=$3)",
                [new_caption, user_id, collection_title]
		)
		.then((res) => {
			callback("Collection caption changed successfully");
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
  };