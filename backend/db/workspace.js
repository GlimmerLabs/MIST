const pool = require("./dbconfig"); // Used for database queries

// +-----------+-------------------------------------------------
// | Workspace |
// +-----------+
const workspaceExists = function (file_name, user_id){
  pool
		.query(
			"select exists (select * from workspaces where (user_id=$1 and file_name=$2)",
			[user_id, file_name]
		)
		.then((res) => {
			return res.rows[0];
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
}


module.exports.saveWorkspace = async (req, callback) => {
  if(workspaceExists(req.body.file_name, req.body.user_id)){
    callback(`Workspace with file name ${req.body.file_name} already exists`);
  }
  else{
    pool
		.query(
			"insert into workspaces (file_name, workspace_nodes, workspace_lines, user_id) \
        values ($1, $2, $3, $4)",
			[req.body.file_name, req.body.workspace_nodes, req.body.workspace_lines, req.body.user_id]
		)
		.then((res) => {
			callback(`Workspace saved`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
  }
}
  
/**
 * Retrieves all file_names for a user
 */
module.exports.getFileNames = async (req, callback) => {
  pool
  .query(
    "select file_name from workspaces where user_id=$1",
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


  /**
   * Retrieves the workspace specified by the given file_name
   */
  module.exports.loadWorkspace = async (req, callback) => {
    pool
		.query(
			"select workspace_nodes, workspace_lines from workspaces where (user_id=$1 and file_name=$2)",
			[req.body.user_id, req.body.file_name]
		)
		.then((res) => {
			return res.rows[0]
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
  }
  
  module.exports.deleteWorkspace = async (req, callback) => {
    pool
		.query(
			"delete from workspaces where (user_id=$1 and file_name=$2)",
			[req.body.user_id, req.body.file_name]
		)
		.then((res) => {
			callback(`Workspace deleted`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
  }


  // +--------------+-------------------------------------------------
// |    Expert    |
// +--------------+

/*
 * Check if the user corresponding to userId has an expertWorkspace with the
 * name of expertWorkspaceName.
 *
 * If user is successfully identified returns
 * {
 *  success: true,
 *  hasWorkspace: ...,
 * }
 * where hasWorkspace is true if the user has an expertWorkspace with the name
 * expertWorkspaceName otherwise false.
 *
 * If user is not successfully identified, returns
 * {
 *  success: false,
 *  message: ...,
 * }
 * where message is the message is our error message.
 */
module.exports.userHasWorkspace = (userId, expertWorkspaceName, res) => {
    const handleSuccess = (user) => {
      if (!user) {
        res.send({
          success: false,
          message: "User could not be located in the database",
        });
      } else {
        if (!user.expertWorkspaces) {
          res.send({
            success: true,
            hasWorkspace: false,
          });
        } else {
          let match = false;
          user.expertWorkspaces.forEach((expertWorkspace) => {
            if (expertWorkspace.name === expertWorkspaceName) {
              match = true;
              return;
            }
          });
          // if no workspace is matched
          res.send({
            success: true,
            hasWorkspace: match,
          });
        }
      }
    };
    const handleError = (error) => {
      res.status(400).send({
        success: false,
        message: "Failed to check due to " + error,
      });
    };
    User.findById(userId)
      .select("expertWorkspaces")
      .exec((error, user) => {
        if (error) handleError(error);
        else handleSuccess(user);
      });
  };
  
  /*
   * saves an expert workspace following the suggestion in the link below
   * https://stackoverflow.com/questions/32549326/mongoose-push-or-replace-element-into-array
   *
   * If successful, returns
   * {
   *  success: true
   * }
   *
   * Otherwise, returns
   * {
   *  success: false,
   *  message: ....
   * }
   * where message, is our error message
   *
   */
  module.exports.saveExpertWorkspace = (userId, workspace, res) => {
    var bulk = User.collection.initializeOrderedBulkOp();
  
    bulk
      .find({
        _id: mongoose.Types.ObjectId(userId),
        "expertWorkspaces.name": workspace.name,
      })
      .updateOne({
        $set: { "expertWorkspaces.$": workspace },
      });
  
    bulk
      .find({
        _id: mongoose.Types.ObjectId(userId),
        "expertWorkspaces.name": { $ne: workspace.name },
      })
      .updateOne({
        $push: { expertWorkspaces: workspace },
      });
    bulk.execute((error, result) => {
      if (error) {
        res.status(400).send({
          success: false,
          message:
            "Error failed to save expert-workspace because of Error: " + error,
        });
      } else {
        if (result.nMatched === 0) {
          // chose nMatched because somehow Mongo was choosing
          // to not modify a document and array if the object inserted
          // is not different from what was already in the array.
          // so we assume that when we have a match the update
          // worked successfully
          res.json({
            success: false,
            message: "Error: Unknown",
          });
        } else {
          res.json({
            success: true,
          });
        }
      }
    });
  };
  
  /*
   * deletes an expert workspace
   *
   * If successful, returns
   * {
   *  success: true
   * }
   *
   * Otherwise, returns
   * {
   *  success: false,
   *  message: ....
   * }
   * where message, is our error message
   *
   */
  module.exports.deleteexpertws = (userId, workspace_name, res) => {
    User.find({ _id: mongoose.Types.ObjectId(userId) })
      .updateOne({
        $pull: { expertWorkspaces: { name: workspace_name } },
      })
      .exec((error, result) => {
        if (error) {
          res.status(400).send({
            success: false,
            message:
              "Error failed to remove expert-workspace because of Error: " +
              error,
          });
        } else {
          if (result.nMatched === 0) {
            res.json({
              success: false,
              message: "Error: Unknown",
            });
          } else {
            res.json({
              success: true,
            });
          }
        }
      });
  };
  
  module.exports.getUserExpertWS = (userId, res) => {
    User.findById(userId)
      .select("expertWorkspaces")
      .exec()
      .then((user) => {
        if (user) return user.expertWorkspaces;
        else {
          res.json({
            success: false,
            message: "user could not be located in the database",
          });
        }
      })
      .then((expertWorkspaces) => {
        res.send({ success: true, expertWorkspaces: expertWorkspaces });
      })
      .catch((error) =>
        res.json({ success: false, message: "Failed due to Error: " + error })
      );
  };