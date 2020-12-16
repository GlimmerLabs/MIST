/**
 * api.js
 *   Functions for handling requests to the API.
 */

// +-------+-----------------------------------------------------------
// | Notes |
// +-------+

/*
The API looks for actions specified by "funct" or "action" in
either GET or POST requests.  You should pass along the appropriate
object (body or whatever) to the run method, along with the request
and the response objects.  (Yes, the method needs a better name
than "run".)
In most cases, the handlers for the actions are found in
handlers.action (see the section about Handlers).  That way,
we can add another action to the API just by adding another
handler.
*/

// +--------------------+--------------------------------------------
// | Required Libraries |
// +--------------------+
require("dotenv").config();
var database = require("./database.js");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// +--------------------+--------------------------------------------
// | Exported Functions |
// +--------------------+

/**
 * Run the API.
 */
module.exports.run = function (info, req, res) {
  // Support both Sam's and Alex's model of specifying what to do
  var action = info.action || info.funct;

  // Make sure that there's an action
  if (!action) {
    fail(res, "No action specified.");
  } // if there's no action

  // Deal with actions with a handler.
  else if (handlers[action]) {
    handlers[action](info, req, res);
  } // if (handlers[action])

  // Everything else is undefined
  else {
    fail(res, "Invalid action: " + action);
  } // invalid action
}; // run

// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Indicate that the operation failed.
 */
fail = function (res, message) {
  console.log("FAILED!", message);
  res.status(400).send(message); // "Bad request"
}; // fail

// https://stackoverflow.com/questions/38820251/how-is-req-isauthenticated-in-passport-js-implemented
function checkAuthentication(request, response, next) {
  if (request.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    // This is the jsend response status for rejected API call
    const responseStatus = "fail";
    // This is the unauthorized/unauthenticated HTTP response status code
    const responseStatusCode = 401;
    const data = { "Authentication": "You need to be logged in!" };
    dispatchResponse(response, responseStatus, responseStatusCode, data);
  };
};

// This implements response in jsend standard https://github.com/omniti-labs/jsend
function dispatchResponse(response, status, statusCode, data, message){
  switch(status){
    case "success":
      response.json({
        "status": "success",
        "data": data
      });
      break;
    case "fail":
      // statusCode should be in the 400s
      response.status(statusCode).json({
        "status": "fail",
        "data": data
      })
      break;
    case "error":
      // statusCode should be in the 500s
      response.status(statusCode).json({
        "status": "error",
        "message": message,
      })
      break;
    default:
      // We do not expect to be here
      throw Error(`Unknown Status: ${status}`);
  }
}

function dispatchError(response, error){
  response.status(500).json({ "status": "error", "message": `Server Error: ${error}`});
}


// +----------+--------------------------------------------------------
// | Handlers |
// +----------+

/**
 * The collection of handlers.
 */
var handlers = {};

// Note: Each handler should have parameters (info, req, res).

// Please keep each set of handlers in alphabetical order.

// +----------------+--------------------------------------------------
// | Image Handlers |
// +----------------+

/**
 * Check if an image exists (should be imagetitleexists)
 *   info.action: imageexists
 *   info.title: The title of the image
 */
handlers.imageExists = function (info, req, res) {
  const next = () => {
    database.imageExists(req.user.username, info.title, (err, response) => {
      if (err) {
        const errorMessage = `Unable to save image due to server error: ${err}`;
        dispatchResponse(res, "error", 500, undefined, errorMessage);
      } else {
        dispatchResponse(res, "success", undefined, { exists: (Boolean)(response) })
      };
    });
  };
  checkAuthentication(req, res, next);
};

/**
 * Save an image to the database
 *   info.action: saveimage
 *   info.title: The title of the image
 */
handlers.saveImage = function (info, req, res) {
  const next = () => {
    const { title, code } = info;
    database.saveImage(req.user._id, title, code)
      .then(() => dispatchResponse(res, "success", undefined, null))
      .catch(error => dispatchResponse(res, "error", 500, undefined, `Error: ${error}`));
  };
  // The user must be authenticated in order to save an image
  checkAuthentication(req, res, next);
};

/**
 *   Get featured images for home pages
 *   info.action: getHomeImages
 */

handlers.getHomeImages = function (info, req, res) {
  database.getFeaturedImagesLoggedOut(4, (images, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!images) res.json([]);
    else res.json(images);
  });
};

/**
 * We expect info to have both an
 * imageId : String
 * albumId : String
 */
handlers.addToAlbum = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "You need to be logged in to save an image to an album",
    });
  } else {
    try {
      const { albumId, imageId } = info;
      const success = await database.addToAlbum(albumId, imageId);
      if (success) {
        res.json({
          success: true,
          message: "Successfully added image to album",
        });
      } else {
        res.json({
          success: false,
          message:
            "Failed to add due to unknown reason, most likely because image already exists in album",
        });
      }
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  }
};

// +--------------------+----------------------------------------------
// | Workspace Handlers |
// +--------------------+

/**
 * Check if an workspace exists
 *   info.action: wsexists
 *   info.title: The title of the image
 */
handlers.workspaceExists = function (info, request, response) {
  const next = () => {
    database.workspaceExists(request.user._id, info.name)
    .then(exists => dispatchResponse(response, 'success', undefined, { exists: exists}))
    .catch(err => dispatchResponse(response, 'error', 500, undefined, `Server Error: ${err}`))
  }
  checkAuthentication(request, response, next);
};

/**
 * Get workspaces
 *  info.action: getws
 *  info.
 */
handlers.getWorkspaces = function (info, req, res) {
  const next = () => {
    database.getWorkspaces(req.user._id)
      .then(({ workspaces }) => dispatchResponse(res, "success", undefined, { workspaces: workspaces }))
      .catch(err => dispatchResponse(res, "error", 500, undefined, `Server Error: ${err}`))
  };
  checkAuthentication(req, res, next);
};

/**
 * Save a workspace.
 *   action: savews
 *   workspace: { name: String, data: Object }
 * Precondition:
 * The user does not already own a workspace by the same name.
 */
handlers.saveWorkspace = async function (info, req, res) {
  const next = () => {
      const workspace = info.workspace;
      database.saveWorkspace(req.user._id, workspace)
      .then(()=> dispatchResponse(res, "success", undefined, null))
      .catch(err => dispatchResponse(res, "error", 500, undefined, `Server Error: ${err}`))
  }
  checkAuthentication(req, res, next);
}; // handlers.saveWorkspace

handlers.deleteWorkspace = async function (info, req, res) {
  const next = () => {
      database.deleteWorkspace(req.user._id, info.name)
      .then(()=> dispatchResponse(res, "success", undefined, null))
      .catch(err => dispatchResponse(res, "error", 500, undefined, `Server Error: ${err}`))
  }
  checkAuthentication(req, res, next);
};

// +----------------+--------------------------------------------------
// | Gallery        |
// +----------------+

/**
 *   Get 9 random public images
 *   info.action: getRandomImages
 */
handlers.getRandomImages = function (info, req, res) {
  let loginStatus = false
  if (req.isAuthenticated())
    loginStatus = true;

  if (loginStatus) {
    // if the user is logged in, show them non-blocked images made from non-blocked users
    database.getRandomImagesLoggedIn(req.user._id, 9, (images, error) => {
      if (error) {
        console.log(error);
        res.json([]);
      } else if (!images) res.json([]);
      else res.json(images);
    });
  }
  else {
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
handlers.getTopImages = function (info, req, res) {
  let loginStatus = false
  if (req.isAuthenticated())
    loginStatus = true;

  if (loginStatus) {
    // if the user is logged in, show them non-blocked images made from non-blocked users
    database.getTopRatedLoggedIn(req.user._id, 9, 1, (images, error) => {
      if (error) {
        console.log(error);
        res.json([]);
      } else if (!images) res.json([]);
      else res.json(images);
    });
  }
  else {
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
handlers.getFeaturedImages = function (info, req, res) {
  let loginStatus = false
  if (req.isAuthenticated())
    loginStatus = true;

  if (loginStatus) {
    // if the user is logged in, show them non-blocked images made from non-blocked users
    database.getFeaturedImagesLoggedIn(req.user._id, 9, (images, error) => {
      if (error) {
        console.log(error);
        res.json([]);
      } else if (!images) res.json([]);
      else res.json(images);
    });
  }
  else {
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
handlers.getRecentImages = function (info, req, res) {
  let loginStatus = false
  if (req.isAuthenticated())
    loginStatus = true;

  if (loginStatus) {
    // if the user is logged in, show them non-blocked images made from non-blocked users
    database.getRecentImagesLoggedIn(req.user._id, 9, 1, (images, error) => {
      if (error) {
        console.log(error);
        res.json([]);
      } else if (!images) res.json([]);
      else res.json(images);
    });
  }
  else {
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

// +----------------+--------------------------------------------------
// | Comments       |
// +----------------+

/**
 *   Post a comment on an image
 *   info.action: postComment
 */

handlers.postComment = function (info, req, res) {
  database.saveComment(req, res);
};

/**
 *  Get all comments on an image
 *  info.action = getComments
 */

handlers.getImageComments = function (info, req, res) {

  let loginStatus = false
  if (req.isAuthenticated())
    loginStatus = true;

  if (loginStatus) {
    database.getCommentsLoggedIn(req.user._id, req.query.id, (comments, error) => {
      if (error) {
        console.log(error);
        res.json([]);
      } else if (!comments) res.json([]);
      else res.json(comments);
    });
   }
  else {
    database.getCommentsLoggedOut(req.query.id, (comments, error) => {
      if (error) {
        console.log(error);
        res.json([]);
      } else if (!comments) res.json([]);
      else res.json(comments);
    });
  }
};

// +----------------+--------------------------------------------------
// | Challenges     |
// +----------------+

/*
 *   Load challenges to the page
 *   info.action: getChallenges
 */

handlers.getChallenges = function (info, req, res) {
  // grab URL parameters
  let search =
    req.query.level + ", " + req.query.color + ", " + req.query.animation;

  database.getChallenges(search, (challenges, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!challenges) res.json([]);
    else res.json(challenges);
  });
};

// +------------------+--------------------------------------------------
// | Authentication   |
// +------------------+

/**
 * Verifies that the email address is correct
 * @param {*} info
 * @param {*} req
 * @param {*} res
 */
handlers.verifyEmail = function (info, req, res) {
  database.User.findOneAndUpdate(
    { token: req.body.token },
    { $set: { verified: true } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Success");
      }
    }
  );
};

/*
 *   Register user to the database
 *   info.action: signup
 */

handlers.signUp = async function (info, req, res) {
  req.body.token = await crypto.randomBytes(32).toString('hex');

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAILID, // generated ethereal user
      pass: process.env.GMAILPASS, // generated ethereal password
    },
  });

  const PUBLIC_IP = process.env.PUBLIC_IP || 'http://localhost:3000';
  let mail = {
    from: process.env.GMAILID,
    to: req.body.email,
    subject: "Email Verification",
    text:
      "Greetings from MIST!" + '\n\n' + "Please use the following link to verify your account:" + '\n\n' + `${PUBLIC_IP}/emailVerification/${req.body.token}`
  };

  database.createUser(req, (message) => {
    if (message === 'User Created') {
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          console.log("Sent!");
          res.json(message);
        }
      });
    } else {
      res.json(message);
    };
  });
};

/*
 *   Log user in
 *   info.action: signIn
 */

handlers.signIn = async function (info, req, res, next) {
  let emailVerify = false;
  await database.User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      emailVerify = user.verified;
	  if (!emailVerify) {
	    res.json("Please Verify Email");
	  } else {
	    try {
	      passport.authenticate("local", (err, user, info) => {
		if (err) {
		  throw err;
		}
		if (!user) {
		  res.json("No User Exists");
		} else {
		  req.logIn(user, (err) => {
		    if (err) throw err;
		    var message = "Success";
		    res.json(message);
		  });
		}
	      })(req, res, next);
	    } catch (error) {
	      console.log(error);
	    }
	  }
    } else {
      res.json("No User Exists");
    }
  });
};

/*
 *   Log user out
 *   info.action: signOut
 */
handlers.signOut = function (info, req, res) {
  req.logout();
  res.json("Success");
};

/*
 *   Get user from Passport
 *   info.action: getUser
 */
handlers.getUser = function (info, req, res) {
  if (!req.user) res.json(null);
  else {
    // we have to search the database for the full user
    // because passport only stores the username of the person logged in
    database.User.findOne({ username: req.user.username }, (err, user) => {
      if (err) fail(res, "no user found");
      else res.json(user);
    });
  }
};

/** */
handlers.getAuthenticatedCompletePersonalProfile = async function (info, req, res) {
  try {
    if (!req.isAuthenticated()) throw "Unauthenticated Guest";
    const userid = req.user._id;
    const complete_user = await database.getCompletePersonalProfile(userid);
    res.json({
      user: complete_user,
    });
  } catch (error) {
    fail(res, error);
  }
};

/** */
handlers.getAuthenticatedCompleteUserProfile = async function (info, req, res) {
  try {
    if (!req.isAuthenticated()) throw "You need to login to view a profile!";
    const userid = info.userid;
    const complete_user = await database.getCompleteUserProfile(userid);
    res.json({
      user: complete_user,
    });
  } catch (error) {
    fail(res, error);
  }
};


// +-----------+------------------------------------------------------
// | Expert UI |
// +-----------+

handlers.expertwsexists = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: "You need to be logged in!" });
  else {
    const userId = req.user._id;
    const name = info.name;
    database.userHasWorkspace(userId, name, res);
  }
};

handlers.saveexpertws = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: "You need to be logged in!" });
  else {
    const userId = req.user._id;
    const workspace = info.workspace;
    database.saveExpertWorkspace(userId, workspace, res);
  }
};

handlers.deleteexpertws = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: "You need to be logged in!" });
  else {
    const userId = req.user._id;
    const workspace_name = info.name;
    database.deleteexpertws(userId, workspace_name, res);
  }
};

handlers.getUserExpertWS = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: "You need to be logged in!" });
  else {
    const userId = req.user._id;
    database.getUserExpertWS(userId, res);
  }
};

// +--------+------------------------------------------------------
// | Albums |
// +--------+

/**
 * Creates an album for a user. We expect info to be of the form:
 * {
 *  name: String
 * }
 */
handlers.createAlbum = async function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: "You need to be logged in" });
  else {
    try {
      const userId = req.user._id;
      const { name, caption } = info;
      const success = await database.createAlbum(userId, name, caption);
      if (success) {
        res.json({
          success: true,
          message: "Successfully saved the album " + name,
        });
      } else {
        throw "Failed to save due to unknown reason";
      }
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  }
};

/**
 * deletes an album. We expect info to be of the form:
 * {
 *  albumId : String
 * }
 *
 * DANGEROUS : DOES NOT CHECK FOR AUTHORIZATION
 */
handlers.deleteAlbum = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json({
      message: "Failed because you have not been authenticated",
      success: false,
    });
  } else {
    try {
      const { albumId } = info;
      const success = await database.deleteAlbum(req.body.albumID);
      const response = success
        ? {
          message: "Succesfully deleted album ",
          success: true,
        }
        : {
          message: "Failed to delete album for unknow reason",
          success: false,
        };
      res.json(response);
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  }
};

/**
 * We expect info to have
 * {
 *  albumId : String,
 *  newName : String,
 * }
 */
handlers.renameAlbum = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "You need to be logged in to rename an album",
    });
  } else {
    try {
      const { albumId, newName } = info;
      const success = await database.renameAlbum(albumId, newName);
      if (success) {
        res.json({
          success: true,
          message: "Successfully renamed album",
        });
      } else {
        res.json({
          success: false,
          message: "Failed to rename album due to unknown reason",
        });
      };
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  };
};
// changes the albums caption
handlers.changeAlbumCaption = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "You need to be logged in to modify an album's caption",
    });
  } else {
    try {
      const { albumId, newCaption } = info;
      const success = await database.changeAlbumCaption(albumId, newCaption);
      if (success) {
        res.json({
          success: true,
          message: "Successfully modified album's caption",
        });
      } else {
        res.json({
          success: false,
          message: "Failed to modify album due to unknown reason",
        });
      };
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  };
};

handlers.removeImageFromAlbum = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "You need to be logged in to remove an image from an album"
    });
  } else {
    try {
      const { albumId, imageId } = info;
      const writeOpResult = await database.removeImageFromAlbum(imageId, albumId);
      if (writeOpResult.nMatched === 0) {
        // strange no documents were match
        res.json({
          success: false,
          message: "Could not find your chosen album."
        })
      } else if (writeOpResult.nModified === 0) {
        // strange no documents were modified
        res.json({
          success: false,
          message: "Image not found in album."
        })
      } else {
        // yay some document was matched
        res.json({
          success: true,
          message: 'Successfully removed image'
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// +----------+----------------------------------------------------------
// | Reporting/Hiding/Blocking |
// +---------------------------+

/**
 * Info contains the type of content that the user wants to hide as way as the
 * ObjectId of the content in the database.
 * info = {
 *  type: STRING,
 *  contentid: STRING,
 * }
 */
handlers.hideContent = async function (info, req, res) {
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
handlers.unhideContent = async function (info, req, res) {
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
handlers.getBlockedStatus = function (info, req, res) {
  if (!req.user)
    res.json(null);
  else {
    database.isBlocked(req.user._id, info.blockedid, (status) => {
      res.json(status)
    })
  }
};

/*
 * Block the user('blockedid') for the current user
 * info.action: blockUser
 * info = {
 *  blockedid: STRING,
 * }
 */
handlers.blockUser = function (info, req, res) {
  if (!req.isAuthenticated())
    throw "You have to be logged in to block a user";
  else
    database.blockUser(req.user._id, req.body.blockedid, (message) => res.json(message))
}


/*
 * Unblock the user('contentid') for the current user
 * info.action: blockUser
 * info = {
 *  contentid: STRING,
 * }
 */
handlers.unblockUser = async function (info, req, res) {
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

// +-----------+------------------------------------------------------
// | Settings  |
// +-----------+

handlers.changeEmail = function (info, req, res) {
  database.changeEmail(req, (message) => res.json(message));
};

handlers.changeUsername = function (info, req, res) {
  database.changeUsername(req, (message) => res.json(message));
};

handlers.changePassword = function (info, req, res) {
  database.changePassword(req, (message) => res.json(message));
};

handlers.deleteAccount = function (info, req, res) {
  database.deleteAccount(req, (message) => {
    req.logout();
    res.json(message);
  });
};

handlers.changeName = function (info, req, res) {
  database.changeName(req, (message) => res.json(message));
};

handlers.changeBio = function (info, req, res) {
  database.changeBio(req, (message) => res.json(message));
};

handlers.changeProfilePic = function (info, req, res) {
  database.changeProfilePic(req, (message) => res.json(message));
};

// +--------+------------------------------------------------------
// | Misc.  |
// +--------+

/**
 * Determines whether or not a user is authorized to Delete an object (album, image, etc...)
 */
handlers.deleteAuthorizationCheck = async function (info, req, res) {
  try {
    const { userId, model, objectId } = info;
    const updateAuthorization = database.updateAuthorizationCheck(
      userId,
      model,
      objectId
    );
    const adminOrModerator = database.isAdminOrModerator(userId);
    Promise.all([updateAuthorization, adminOrModerator]).then((values) => {
      res.json({
        success: true,
        authorized: values[0] || values[1],
      });
    });
  } catch (error) {
    res.json({
      success: false,
      authorized: false,
    });
  }
};

/**
 * Determines whether or not a user is authorized to Update an object (album, image, etc...)
 */
handlers.updateAuthorizationCheck = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json({
      success: false,
      message: "You need to be logged in!",
    });
  } else {
    try {
      const { userId, model, objectId } = info;
      const authorized = Boolean(
        await database.updateAuthorizationCheck(userId, model, objectId)
      );
      res.json({
        success: true,
        authorized: authorized,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error,
      });
    }
  }
};

handlers.addImageToAlbum = async function (info, req, res) {
  try {
    const writeOpResult = await database.addToAlbum(req.body.album._id, req.body.imgID);
    res.json({
      success: writeOpResult,
      message: writeOpResult ? 'Successfully added image!' : 'Failed to add image for unknown reason.'
    });
  } catch (error) {
    res.json({
      message: error
    });
  }
}

// +--------+------------------------------------------------------
// |  Users |
// +--------+

