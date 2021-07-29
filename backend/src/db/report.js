// +----------+----------------------------------------------------------
// | Reporting/Hiding/Blocking |
// +---------------------------+

const pool = require("./dbconfig");
  
module.exports.sendReport = async (req, callback) => {
  pool
		.query(
			"insert into reports (user_id, reason, message) \
        values ($1, $2, $3)",
			[req.body.user_id, req.body.reason, req.body.message]
		)
    .query(
      "update users set reported_flags = reported_flags + 1 wwhere user_id = $1",
      [req.body.user_id])
		.then((res) => {
			callback(`Report has been sent`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
}

//Show all the report flags of an user
module.exports.getReports = async (req, callback) => {
  pool
  .query(
    "select * from reports where user_id=$1",
    [req.body.user_id]
  )
  .then((res) => {
    return res.rows;
  })
  .catch((err) => {
    handleDBError(err, callback);
    return;
  });
}

//Show 15 users who have most reports
module.exports.getReportedUsers = async (req, callback) => {
  let offset = req.body.page * 30;
    pool
    .query(
      "select * from users order by report_flags desc limit 15 offset $1",
      [offset]
    )
}

// Determines if an userid exists in  blocked_users
// Returns a boolean value
const checkUseridExists = async (user_id, callback) => {
	pool
  .query(
		`select exists (select 1 from blocked_users where user_id = $1)`,
		[user_id]
	)
  .then((res) => {
    return res.rows[0].exists;
  })
  .catch((err) => {
    handleDBError(err, callback);
    return;
  });
};

 /**
   * returns whether a user has blocked the user in question
   * @param user_id: the user's id 
   * @param blocked_user_id: the user in question of being blocked's id 
   * @param callback: returns true if the user is blocked, false otherwise 
   */
  module.exports.isBlocked = (req, callback) => {
      if (!(await checkUseridExists(req.body.user_id, callback))) {
        callback("User ID does not exist!");
      }
      pool
      .query(
        "select exists (select * from posts where (user_id=$1 and blocked_user_id=$2))",
        [req.body.user_id, req.body.blocked_user_id]
      )
      .then((res) => {
        return res.rows[0].exists;
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      });
    };
  
  /**
   * blocks a user
   * @param userid: the ID of the user who wants to block a user 
   * @param blockedid: the ID of the user to be blocked 
   * @param callback: message to be displayed (failed or success)
   * returns true if successfull, false otherwise
   */
  module.exports.blockUser = async (req, callback) => {
    if (!(await checkUseridExists(req.body.user_id, callback))) {
      callback("User ID does not exist!");
      return;
    }
    pool
      .query(
        "insert into blocked_users (user_id, blocked_user_id) \
        values ($1, $2)",
        [req.body.user_id, req.body.blocked_user_id]
      )
      .then((res) => {
        callback(`Successfully blocked user`);
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      });
  }
  
  /**
   * unblocks a user
   * @param userid: the objectId of the user who wants to block a user 
   * @param blockedid: the objectId of the user to be blocked 
     */
   module.exports.unblockUser = async (req, callback) => {
    pool
      .query("delete from collections where (user_id=$1 and blocked_user_id=$2)"
        [req.body.user_id, req.body.blocked_id]
        )
      .then((res) => {
          callback(`Successfully unblock user`);
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      });
  }

  module.exports.getBlockedUsers = async (user_id, callback) => {
    pool
      .query("select blocked_user_id from blocked_users where user_id=$1"
        [user_id]
        )
      .then((res) => {
          return res.rows
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      });
  }
  
  