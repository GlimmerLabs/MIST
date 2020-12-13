const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");
const bcrypt = require("bcrypt");

const mongoURI = process.env.ATLAS_URI || `mongodb://localhost:27017/${process.env.LOCAL_DB_NAME}`;
// why was this changed to acme??
// Following suggestion in https://mongoosejs.com/docs/connections.html 
mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) // make connection to database or create it if it does not yet exist
  .then(
    () => {
      /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
      console.log(`Connection made to ${mongoURI}.`);
    },
    err => {
      /** handle initial connection error */
      console.log(`ERROR: ${err}`);
    }
  );

mongoose.set("useFindAndModify", false);

// +--------+----------------------------------------------------------
// | Models |
// +--------+

// We define each model schema in its own module because it is 
// strongly recommended by MDN: (link below)
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose 

const Album = require('../Models/Album');
const Comment = require('../Models/Comment');
const Challenge = require('../Models/Challenge');
const Image = require('../Models/Image');
const Report = require('../Models/Report');
const Workspace = require('../Models/Workspace');
const User = require('../Models/User');

// Export models
module.exports.User = User;

// +-----------+-------------------------------------------------
// | Utilities |
// +-----------+

const Models = {
  Image: Image,
  Comment: Comment,
  Album: Album,
  Challenge: Challenge,
  Workspace: Workspace,
  Report: Report,
};

// everything after this is queries

// +------------+-------------------------------------------------
// |   Images   |
// +------------+

/**
 * checks whether the user owns an image with the same title
 * @param username the username of the user
 * @param title the title of the image
 * @param callback sends the error if there is one, true
 * if the image exists, and false if it does not
 */
module.exports.imageExists = (username, title, callback) => {
  User.findOne({ username: username })
    .populate("images")
    .exec((err, user) => {
      if (err) callback(err, null);
      else {
        let response = false;
        user.images.forEach((image) => {
          if (image.title === title) {
            response = true;
            return;
          }
        });
        callback(null, response);
      }
    });
};

/**
 * saves the new image in the database
 * @param userId the user._id of the user
 * @param title title of the image
 * @param code code for the image
 * @returns {object} a MongoDB writeOpResult that shows if the image has been linked to the user
 */
module.exports.saveImage = async (userId, title, code) => {
  //build image
  let image = Image({
    userId: sanitize(userId),
    title: sanitize(title),
    code: sanitize(code),
    public: true,
    caption: "",
  });
  //save image
  const imageDocument = await image.save();
  if (!imageDocument) {
    throw Error('Unknown reason.')
  }
  const writeOpResult = await User.updateOne({ _id: userId }, { $push: { images: image._id } }).exec();
  // We need to verify that the image has been linked to the user
  if (writeOpResult.nMatched === 0) {
    // We do not expect to be in this case as there must be at least one match because the user must
    // be authorized in order to make this query. Hence there should be a matching user document.
    throw Error("Linking image to user failed because we could not locate the user's document.");
  }
  if (writeOpResult.nModified === 0) {
    // We do not expect to be in this case as there the query is done by the push operator
    // on an existing user document. As the user document should exist with an array as the value 
    // corresponding to its "images" field, this should succeed. We will default to say that it 
    // is because the user's document is exceed the default maximum capacity of 16MB.
    throw Error("Linking image to user failed because there is not enough space.")
  }
};

/**
 * Adds an image to an album
 * @param {String} albumId 
 * @param {String} imageId 
 */
module.exports.addToAlbum = async (albumId, imageId) => {
  // Sanitize inputs.  Yay!
  albumId = sanitize(albumId);
  imageId = sanitize(imageId);
  return await Album.updateOne({ _id: albumId }, { $addToSet: { images: imageId }, updatedAt: Date.now() }).exec()
    .then(writeOpResult => (Boolean)(writeOpResult.nModified))
    .catch(error => { throw error })
};

// rename an album
module.exports.renameAlbum = async (albumId, newName) => {
  // Sanitize inputs.  Yay!
  albumId = sanitize(albumId);
  newName = sanitize(newName);

  return await Album.updateOne({ _id: albumId }, { name: newName, updatedAt: Date.now() }).exec()
    .then(writeOpResult => writeOpResult.nModified)
    .catch(error => { throw error })

};

// change an album's caption
module.exports.changeAlbumCaption = async (albumId, newCaption) => {
  // Sanitize inputs.  Yay!
  albumId = sanitize(albumId);
  newCaption = sanitize(newCaption);

  return await Album.updateOne({ _id: albumId }, { caption: newCaption, updatedAt: Date.now() }).exec()
    .then(writeOpResult => writeOpResult.nModified)
    .catch(error => { throw error })
};

// +------------+-------------------------------------------------
// |   Gallery  |
// +------------+

/**
 * grab random images for logged out user
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error
 */
module.exports.getRandomImagesLoggedOut = (count, callback) => {
  Image.aggregate([
    // find only public and active images
    { $match: { public: true, active: true } },
    { $sample: { size: count } },
  ]).exec((err, images) => {
    if (err) callback(null, err);
    else {
      // populate the images with the user information so we can access their username
      Image.populate(images, { path: "userId" }, (err, images) => {
        if (err) callback(null, err);
        else callback(images, null);
      });
    }
  });
};

/**
 * grab random images for logged in user
 * Excludes images the user has hidden or blocked
 * @param count: the max amount of images returned 
 * @param callback: returns either the images or the error 
 */
module.exports.getRandomImagesLoggedIn = (userId, count, callback) => {
  module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
    if (err)
      callback(null, err)
    else {
      Image.aggregate([
        {
          $match: {
            public: true,
            active: true,
            // exlude the blocked images
            _id: { $nin: contentIds },
            // exclude the blocked users
            userId: { $nin: blockedUsers }
          }
        },
        { $sample: { size: count } }])
        .exec((err, images) => {
          if (err)
            callback(null, err)
          else {
            // populate the images with the user information so we can access their username
            Image.populate(images, { path: "userId" }, (err, images) => {
              if (err) callback(null, err);
              else callback(images, null);
            });
          }
        });
    }
  })
};


/**
 * grab featured images for logged out user
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error
 */
module.exports.getFeaturedImagesLoggedOut = (count, callback) => {
  Image.find({ featured: true, active: true })
    .limit(count)
    .populate("userId")
    .exec((err, images) => {
      if (err) callback(null, err);
      else {
        callback(images, null);
      }
    });
};

/**
 * grab featured images for logged in user
 * Excludes images the user has hidden or blocked
 * @param count: the max amount of images returned 
 * @param callback: returns either the images or the error 
 */
module.exports.getFeaturedImagesLoggedIn = (userId, count, callback) => {
  module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
    if (err)
      callback(null, err)
    else {
      Image.find({
        featured: true,
        active: true,
        // exlude the blocked images
        _id: { $nin: contentIds },
        // exclude the blocked users
        userId: { $nin: blockedUsers }
      })
        .limit(count)
        .exec((err, images) => {
          if (err)
            callback(null, err)
          else {
            // populate the images with the user information so we can access their username
            Image.populate(images, { path: "userId" }, (err, images) => {
              if (err) callback(null, err);
              else callback(images, null);
            });
          }
        })
    }
  })
};

/**
 * grab recent images for logged out user
 * @param count: the max amount of images returned for the page
 * @param page: the current page (boolean)
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
 *        This has not been implemented on the front-end yet, but it is left here for future use.
 *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
 *        next page.
 * @param callback: returns either the images, page(boolean), and the error
 */
module.exports.getRecentImagesLoggedOut = (count, page, callback) => {
  Image.find({ public: true, active: true })
    // most recent -> least recent order
    .sort({ createdAt: -1 })
    .limit(count)
    .populate("userId")
    .exec((err, images) => {
      if (err) callback(null, null, err);
      // if the page number is less than the count, then we do not have a next page
      else if (images.length <= count) {
        callback(images, false, err);
      } else {
        callback(images, true, err);
      }
    });
};

/**
 * grab recent images for logged in user
 * Excludes images the user has hidden or blocked
 * @param count: the max amount of images returned for the page
 * @param page: the current page (boolean)
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
 *        This has not been implemented on the front-end yet, but it is left here for future use.
 *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
 *        next page.
 * @param callback: returns either the images, page(boolean), and the error 
 */
module.exports.getRecentImagesLoggedIn = (userId, count, page, callback) => {
  module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
    if (err)
      callback(null, null, err)
    else {
      Image.find({
        public: true,
        active: true,
        // exlude the blocked images
        _id: { $nin: contentIds },
        // exclude the blocked users
        userId: { $nin: blockedUsers }
      })
        .sort({ createdAt: -1 })
        .limit(count)
        .exec((err, images) => {
          if (err)
            callback(null, null, err);
          // if the page number is less than the count, then we do not have a next page
          else if (images.length <= count) {
            Image.populate(images, { path: "userId" }, (err, images) => {
              if (err) callback(null, null, err);
              else callback(images, false, null);
            });
          }
          else {
            // populate the images with the user information so we can access their username
            Image.populate(images, { path: "userId" }, (err, images) => {
              if (err) callback(null, null, err);
              else callback(images, true, null);
            });
          }
        })
    }
  })
};

/**
 * grab top rated images for logged out user
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 * @param page: the current page (boolean)
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
 *        This has not been implemented on the front-end yet, but it is left here for future use.
 *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
 *        next page.
 * @param callback: returns either the images, page(boolean), and the error
 */
module.exports.getTopRatedLoggedOut = (count, page, callback) => {
  Image.find({ public: true, active: true })
    .sort({ ratings: -1 })
    .limit(count)
    .populate("userId")
    .exec((err, images) => {
      if (err) callback(null, null, err);
      // if the page number is less than the count, then we do not have a next page
      else if (images.length <= count) callback(images, false, err);
      else callback(images, true, err);
    });
};

/**
 * grab top rated images for logged in user
 * Excludes images the user has hidden or blocked
 * @param count: the max amount of images returned for the page
 * @param page: the current page (boolean)
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
 *        This has not been implemented on the front-end yet, but it is left here for future use.
 *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
 *        next page.
 * @param callback: returns either the images, page(boolean), and the error 
 */
module.exports.getTopRatedLoggedIn = (userId, count, page, callback) => {
  module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
    if (err)
      callback(null, null, err)
    else {
      Image.find({
        public: true,
        active: true,
        // exlude the blocked images
        _id: { $nin: contentIds },
        // exclude the blocked users
        userId: { $nin: blockedUsers }
      })
        .sort({ ratings: -1 })
        .limit(count)
        .exec((err, images) => {
          if (err)
            callback(null, null, err);
          // if the page number is less than the count, then we do not have a next page 
          else if (images.length <= count)
            Image.populate(images, { path: "userId" }, (err, images) => {
              if (err) callback(null, null, err);
              else callback(images, false, null);
            });
          else
            // populate the images with the user information so we can access their username
            Image.populate(images, { path: "userId" }, (err, images) => {
              if (err) callback(null, null, err);
              else callback(images, true, null);
            });
        })
    }
  })
};

// +----------------+-------------------------------------------------
// |   Challenges   |
// +----------------+

module.exports.getChallenges = (category, callback) => {
  Challenge.find({ category: category }, (err, challenges) => {
    if (err) callback(null, err);
    else callback(challenges, null);
  });
};

// +----------------+-------------------------------------------------
// |    Comments    |
// +----------------+

/**
 * saves the comment in the comments collection,
 * the user's comment array, and to image's comment array
 */
module.exports.saveComment = function (req, res) {
  // build the comment
  //let userID = req.user._id;
  let userID = req.body.userId;
  //let imageID = sanitize(req.params.imageid)
  let imageID = req.body.imageId;
  let comment = Comment({
    userId: userID,
    //body: sanitize(req.body.newComment),
    body: req.body.body,
    active: req.body.active,
    imageId: imageID,
    flags: req.body.flags,
  });

  //save comment
  comment
    .save()
    .then((comment) => {
      //push comment to user's comment array
      User.updateOne(
        { _id: mongoose.Types.ObjectId(userID) },
        { $push: { comments: comment._id } }
      )
        .exec()
        .then((writeOpResult) => {
          if (writeOpResult.nModified === 0) {
            console.log("Failed to insert comment into user's array");
          }
        })
        .catch((err) => {
          console.error(err);
          res.end(JSON.stringify(error));
        });
      //push comment to image's comment array
      Image.updateOne({ _id: imageID }, { $push: { comments: comment._id } })
        .exec()
        .then((writeOpResult) => {
          if (writeOpResult.nModified === 0) {
            console.log("Failed to insert comment into image's array");
          } else console.log("Inserted Comment");
        })
        .catch((err) => {
          console.error(err);
          res.end(JSON.stringify(error));
        });
      res.redirect("back");
    })
    .catch((err) => {
      console.error(err);
      res.end(JSON.stringify(error));
    });
};

//NOTE: This does not check if the comments are hidden from the user
// the commented out commentInfo does
/**
 * grab comment information
 * only returns active comments
 * @param imageid
 * @param callback
 */
module.exports.getCommentsLoggedOut = (imageid, callback) => {
  imageid = sanitize(imageid);

  // search the comments collection for documents that with imageid that match image._id
  Comment.find({
    imageId: mongoose.Types.ObjectId(imageid),
    active: true,
  })
    .populate("userId")
    .exec((err, comments) => {
      if (err) {
        console.log(err);
        callback(null, err);
      } else {
        callback(comments, null);
      }
    });
};

/**
 * grab comment information
 * only returns active not-hidden comments
 * @param userid 
 * @param imageid 
 * @param callback 
 */
module.exports.getCommentsLoggedIn = (userid, imageid, callback) => {
  imageid = sanitize(imageid);
  userid = sanitize(userid);

  module.exports.getHiddenAndBlockedIDs(userid, "comment", (contentIds, blockedUsers, err) => {
    if (err)
      callback(null, err)
    else {
      // how to return five at time? because rn we are returning all comments
      // look into aggregation
      Comment.
        find({
          //exclude hidden comments and blocked users
          _id: { $nin: contentIds },
          userId: { $nin: blockedUsers },
          imageId: mongoose.Types.ObjectId(imageid),
          //include only active comments
          active: true,
        }).
        populate('userId').
        exec((err, comments) => {
          if (err) {
            console.log(err);
            callback(null, err);
          } else {
            callback(comments, null);
          }
        });
    }
  })
};

// +------------+-------------------------------------------------
// |    Users   |
// +------------+



/**
 * Checks if the password is secure enough when the user is signing up
 */
passwordSecurity = (pass) => {
  let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let checkNumber = false;
  let checkSpecial = false;
  let Special = ["!", "@"];
  if (pass.length < 8) {
    return "Required: At least 8 characters";
  }
  for (let i = 0; i < Special.length; i++) {
    if (pass.includes(Special[i])) {
      checkSpecial = true;
    }
  }
  for (let i = 0; i < digits.length; i++) {
    if (pass.includes(digits[i])) {
      checkNumber = true;
    }
  }
  if (!checkSpecial) {
    return "Required: At least one special character";
  } else if (!checkNumber) {
    return "Required: At least one digit";
  } else {
    return "Success";
  }
};
/**
 * Changes the password of the user
 * 
 * @param {*} req 
 * @param {*} callback 
 */
module.exports.changePassword = async (req, callback) => {
  let dbPassword = "";
  await User.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      console.log("No doc");
      console.log(err);
    }
    dbPassword = doc.password;
  });
  bcrypt.compare(req.body.currentPassword, dbPassword, async (err, result) => {
    if (err) {
      callback(err);
    }
    if (result === false) {
      callback("Old Password Does Not Match");
    } else {
      if (passwordSecurity(req.body.newPassword) !== "Success") {
        callback(passwordSecurity(req.body.newPassword));
      } else {
        let newPass = await bcrypt.hash(req.body.newPassword, 12);
        User.findOneAndUpdate(
          { _id: req.body._id },
          { $set: { password: newPass } },
          { new: true },
          (err, doc) => {
            if (err) {
              callback(err);
            } else {
              callback("Successfully Updated Password");
            }
          }
        );
      }
    }
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
  User.updateOne(
    { _id: req.user._id },
    { $set: { email: sanitize(req.body.newEmail) } },
    { new: true },
    (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback("Successfully Updated Email");
      }
    }
  );
};

/**
 * Changes the username of the user in the database 
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the username is taken, was successfully updated, or an error occurred
 */
module.exports.changeUsername = (req, callback) => {

  if (req.body.newUsername === "")
    callback("Username cannot be blank")
  else {
    User.find({ username: req.body.newUsername }, (err, docs) => {
      if (docs.length) {
        callback("Username already in use, try something else")
      } else {
        User.updateOne(
          { _id: req.user._id },
          { $set: { username: sanitize(req.body.newUsername) } },
          { new: true },
          (err, doc) => {
            if (err) {
              callback(err);
            } else {
              callback("Successfully Updated Username");
            }
          }
        );
      }
    })
  }
};

/**
 * Changes the name of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the name was successfully updated or an error occurred
 */
module.exports.changeName = (req, callback) => {
  User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        forename: sanitize(req.body.newFirstName),
        surname: sanitize(req.body.newLastName)
      }
    },
    { new: true },
    (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback("Successfully Updated Name");
      }
    }
  );
};

/**
 * Changes the bio of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the bio was successfully updated or an error occurred
 */
module.exports.changeBio = (req, callback) => {
  User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        about: sanitize(req.body.newBio)
      }
    },
    { new: true },
    (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback("Successfully Updated Bio");
      }
    }
  );
};


/**
 *
 * @param {*} req
 * @param {*} callback
 * Changes the profile picture of the user in the database
 * Returns a message if the profile picture was succesfully updated or an error occured
 */
module.exports.changeProfilePic = (req, callback) => {
  User.updateOne(
    { _id: req.user._id },
    {
      $set: {
        profilepic: sanitize(req.body.newProfilePic)
      }
    },
    { new: true },
    (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback("Successfully Updated Profile Picture");
      }
    }
  );
};


// given a userId, returns the username
module.exports.getUsername = (userId, callback) => {
  User.findById(userId).exec((err, user) => {
    if (err) callback(null, err);
    else callback(user.username, null);
  });
};

/**
 * Deletes the user's account
 * @param {*} req 
 * @param {*} callback 
 */

module.exports.deleteAccount = async (req, callback) => {
  let dbPassword = "";
  await User.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      console.log(err);
    }
    dbPassword = doc.password;
  })
  bcrypt.compare(req.body.currentPassword, dbPassword, (err, result) => {
    if (err) {
      callback(err);
    }
    if (result === false) {
      callback("Old Password Does Not Match");
    } else {
      User.findOneAndDelete({ _id: req.body._id }, (err, doc) => {
        if (err) {
          callback(err)
        } else {
          callback("Deleted. Please Sign Out.")
        }
      })
    }
  })
}


/**
 * creates a new user in the database
 * @param req the request, must contain a user object
 * with username, firstname, lastname, username, password, and email
 * @param callback returns if the user exists already or if the user was created succesfully
 */
module.exports.createUser = (req, callback) => {
  let user = req.body;
  User.findOne({ username: user.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) callback("User Already Exists");
    if (!doc) {
      let passwordMessage = passwordSecurity(user.password);
      if (passwordMessage !== "Success") {
        callback(passwordMessage);
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
          forename: user.firstname,
          surname: user.lastname,
          username: user.username,
          password: hashedPassword,
          email: user.email,
          verified: false,
          admin: false,
          moderator: false,
          token: user.token,
        });
        await newUser.save();
        callback("User Created");
      }
    }
  });
};

// given a username, returns the userId
module.exports.getUserIdByUsername = (username, callback) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return callback(err, null);
    else return callback(null, user._id);
  });
};

// Returns all images and albums for the user's profile
module.exports.getCompletePersonalProfile = async (userid) => {
  userid = sanitize(userid);
  return (User
    .findById(userid)
    .populate({
      path: 'images',
      match: { active: true },
    })
    .populate({
      path: 'albums',
      match: { active: true },
      populate: { path: 'images', match: { active: true } }
    })
    .select('-password')
    .exec())
  //     .select('images albums')
};


// Returns all images and albums for viewing another user's profile
module.exports.getCompleteUserProfile = async (userid) => {
  userid = sanitize(userid);
  return (User
    .findById(userid)
    .populate({
      path: 'images',
      match: {
        active: true,
        public: true
      },
    })
    .populate({
      path: 'albums',
      match: {
        active: true,
        public: true
      },
      populate: {
        path: 'images', match: {
          active: true,
          public: true
        }
      }
    })
    .select('-password')
    .exec())
};

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

// +-----------+-------------------------------------------------
// | Workspace |
// +-----------+
module.exports.saveWorkspace = async (userId, workspace) => {
  const bulkWriteOpResult = await User.bulkWrite(
    [
      {
        updateOne: {
          filter: {
            _id: mongoose.Types.ObjectId(userId),
            "workspaces.name": workspace.name,
          },
          update: { "workspaces.$.data": workspace.data },
        },
      },
      {
        updateOne: {
          filter: {
            _id: mongoose.Types.ObjectId(userId),
            "workspaces.name": { $ne: workspace.name },
          },
          update: { $push: { workspaces: new Workspace(workspace) } },
        },
      },
    ],
    { ordered: true }
  );
  if (bulkWriteOpResult.nMatched === 0) {
    throw "Error Unknown";
  }
  if (bulkWriteOpResult.nModified === 0) {
    throw "Error Unknown";
  } 
}

/**
 * Retrieves the workspaces corresponding to userid
 * We assume that userid corresponds to a user existing in the database
 */
module.exports.getWorkspaces = async (userid) =>
  User.findById(userid).select("workspaces.data workspaces.name").exec();

/**
 * Checks if the user corresponding to userid has a workspace by the
 * name wsname. We assume that userid corresponds to an existing and active
 * user in the database
 *
 */
module.exports.workspaceExists = async (userid, wsname) => (
  User.findOne({
    _id: mongoose.Types.ObjectId(userid),
    "workspaces.name": wsname,
  })
    .countDocuments()
    .exec()
)

module.exports.deleteWorkspace = async (userId, workspace_name) => (
  User.findOne({ _id: mongoose.Types.ObjectId(userId) })
    .updateOne({
      $pull: { workspaces: { name: workspace_name } },
    })
    .exec()
)

// +--------+----------------------------------------------------------
// | Albums |
// +--------+

// create Album
module.exports.createAlbum = async (userid, name, caption) => {
  userid = sanitize(userid);
  name = sanitize(name);
  caption = sanitize(caption)
  let album = new Album({
    name: name,
    userId: userid,
    public: false,
    active: true,
    flag: false,
    caption: caption,
  }) // create album document object 
  try {
    //save the album object
    const albumObject = await album.save();
    if (albumObject) {
      return (
        User
          .updateOne({ _id: userid }, { $push: { albums: albumObject._id } })
          .exec()
          .then(writeOpResult => writeOpResult.nModified)
          .catch(error => { throw error })
      );
    } else {
      throw 'Failed to safe for Unknown reason'
    }
  } catch (error) {
    throw error;
  }
}; // createAlbum

/**
* deletes an album
* DANGEROUS DOES NOT CHECK FOR AUTHORIZATION
* @param userId: the object ID for the user
* @param albumId: the object ID for the album
*/
module.exports.deleteAlbum = async (albumId) => {
  // sanitize ID's
  //albumId = sanitize(albumId);
  return await Album.deleteOne({ _id: albumId })
    .catch(error => { throw error })
}

// remove image from album
module.exports.removeImageFromAlbum = async (imageId, albumId) => {
  return Album.updateOne({ _id: sanitize(albumId) }, { $pull: { "images": sanitize(imageId) }, updatedAt: Date.now() }).exec();
}
// +----------+----------------------------------------------------------
// | Reporting/Hiding/Blocking |
// +---------------------------+

/**
 * returns the contentIds for a user's hidden content and their blocked users
 * @param userId: the object id of the user
 * @param type: the type of content (comment, album, or image) 
 * @param callback : returns the ids or the error
 */
module.exports.getHiddenAndBlockedIDs = (userId, type, callback) => {
  User.findById(userId).exec((err, user) => {
    if (!user)
      callback(false, false, "User does not exist.");
    else {
      if (type === "comment")
        callback(user.hidden.commentIds, user.blockedUsers, null);
      else if (type === "album")
        callback(user.hidden.albumIds, user.blockedUsers, null);
      else if (type === "image")
        callback(user.hidden.imageIds, user.blockedUsers, null);
      else
        callback(false, false, "Incorrect type");
    }
  });
}

/**
 * hide content from a user
 * @param userid: the objectId of the user wanting to hide something
 * @param type: the type of content being hidden: "comment", "image", or "album" 
 * @param contentId: the objectId of the content being hidden 
 * @return true if successful, false otherwise 
 */
module.exports.hideContent = async (userid, type, contentId) => {
  userid = sanitize(userid);
  type = sanitize(type);
  contentId = sanitize(contentId);
  try {
    let update;
    switch (type) {
      case "comment":
        update = { $push: { "hidden.commentIds": contentId } }
        break;
      case "album":
        update = { $push: { "hidden.albumIds": contentId } }
        break;
      case "image":
        update = { $push: { "hidden.imageIds": contentId } }
        break;
      default:
        throw "invalid type";
    }
    const { nModified } = await User.updateOne({ _id: userid }, update).exec();
    return (Boolean)(nModified);
  } catch (error) {
    throw error;
  }
}

/**
 * unhide content from a user
 * @param userid: the objectId of the user wanting to unhide something
 * @param type: the type of content being hidden: "comment", "image", or "album" 
 * @param contentid: the objectId of the content being unhidden 
 * @returns true if successful, false otherwise 
 */
module.exports.unhideContent = async (userid, type, contentid) => {
  try {
    let update;
    switch (type) {
      case "comment":
        update = { $pull: { "hidden.commentIds": contentid } }
        break;
      case "album":
        update = { $pull: { "hidden.albumIds": contentid } }
        break;
      case "image":
        update = { $pull: { "hidden.imageIds": contentid } }
        break;
      default:
        throw "invalid type";
    }
    const { nModified } = await User.updateOne({ _id: userid }, update).exec();
    return (Boolean)(nModified);
  } catch (error) {
    throw error;
  }
}


/**
 * returns whether a user has blocked the user in question
 * @param userid: the user's id 
 * @param blockedid: the user in question of being blocked's id 
 * @param callback: returns true if the user is blocked, false otherwise 
 */
module.exports.isBlocked = (userid, blockedid, callback) => {
  User.findOne({ _id: userid, blockedUsers: { $in: [blockedid] } },
    (err, user) => {
      if (user)
        callback(true)
      else
        callback(false)
    })
}

/**
 * blocks a user
 * @param userid: the objectId of the user who wants to block a user 
 * @param contentid: the objectId of the user to be blocked 
 * @param callback: message to be displayed (failed or success)
 * returns true if successfull, false otherwise
 */
module.exports.blockUser = async (userid, blockedid, callback) => {
  return await User.updateOne({ _id: userid }, { $push: { blockedUsers: blockedid } }).exec()
    .then(writeOpResult => (Boolean)(writeOpResult.nModified))
    .then(callback("Successfully blocked user"))
    .catch(error => { callback("Uh-oh something went wrong, we could not block this user at this time.") })
}

/**
 * unblocks a user
 * @param userid: the objectId of the user who wants to block a user 
 * @param contentid: the objectId of the user to be blocked 
 * @returns true if successful, false otherwise
 */
module.exports.unblockUser = async (userid, contentid) => {
  return await User.updateOne({ _id: userid }, { $pull: { blockedUsers: contentid } }).exec()
    .then(writeOpResult => (Boolean)(writeOpResult.nModified))
    .catch(error => { throw error })
}



// +-------+-------------------------------------------------
// | Misc. |
// +-------+


module.exports.isAdminOrModerator = async (userId) => (
  User.findOne({
    _id: userId,
    $or: [{ admin: true }, { moderator: true }]
  }).countDocuments().exec()
)

module.exports.updateAuthorizationCheck = async (userId, model, objectId) => (
  Models[model]
    .findOne({ _id: objectId, userId: userId })
    .countDocuments()
    .exec())