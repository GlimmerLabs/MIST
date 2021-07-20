  const pool = require("./dbconfig");
  const reportDB = require("report.js");

// +------------+-------------------------------------------------
// |   Gallery  |
// +------------+

  const stringifyBlockedUsers = async (user_id, callback) => {
    let blockedUsers = reportDB.getBlockedUsers(user_id, callback);
    return blockedUsers.stringify();
  }

  /**
   * grab random images for logged out user
   * @param count: the max amount of images returned
   * @param callback: returns either the images or the error
   */
  module.exports.getRandomImagesLoggedOut = (req, callback) => {
    let offset = req.body.page * 15;

    pool
    .query(
      "select * from posts order by random() limit 15 offset $1",
      [offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
    });
  };
  
  /**
   * grab random images for logged in user
   * Excludes images the user has hidden or blocked
   * @param count: the max amount of images returned 
   * @param callback: returns either the images or the error 
   */
   module.exports.getRandomImagesLoggedIn = (req, callback) => {
    let offset = req.body.page * 15;
    let blocked_users = stringifyBlockedUsers(req.body.user_id, callback);

    pool
    .query(
      "select * from posts order by random() where not user_id = any(array$1) limit 15 offset $2",
      [blocked_users, offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
    });
  };
  
  
  /**
   * grab featured images for logged out user
   * @param count: the max amount of images returned
   * @param callback: returns either the images or the error
   */
  module.exports.getFeaturedImagesLoggedOut = (req, callback) => {
    let offset = req.body.page * 15;

    pool
    .query(
      "select * from posts order by random() limit 15 offset $1",
      [offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
    });
  };
  
  /**
   * grab featured images for logged in user
   * Excludes images the user has hidden or blocked
   * @param count: the max amount of images returned 
   * @param callback: returns either the images or the error 
   */
  module.exports.getFeaturedImagesLoggedIn = (req, callback) => {
    let offset = req.body.page * 15;
    let blocked_users = stringifyBlockedUsers(req.body.user_id, callback);

    pool
    .query(
      "select * from posts order by created_at where (featured=true and not user_id = any(array$1)) limit 15 offset $2",
      [blocked_users, offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
    });
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
  module.exports.getRecentImagesLoggedOut = (req, callback) => {
    let offset = req.body.page * 15;

    pool
    .query(
      "select * from posts order by created_at limit 15 offset $1",
      [offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
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
  module.exports.getRecentImagesLoggedIn = (req, callback) => {
    let offset = req.body.page * 15;
    let blocked_users = stringifyBlockedUsers(req.body.user_id, callback);

    pool
    .query(
      "select * from posts order by created_at where not user_id = any(array$1) limit 15 offset $2",
      [blocked_users, offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
    });
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
  module.exports.getTopRatedLoggedOut = (req, callback) => {
    let offset = req.body.page * 15;

    pool
    .query(
      "select * from posts order by likes desc limit 15 offset $1",
      [offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
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
  module.exports.getTopRatedLoggedIn = (req, callback) => {
    let offset = req.body.page * 15;
    let blocked_users = stringifyBlockedUsers(req.body.user_id, callback);

    pool
    .query(
      "select * from posts order by likes desc where not user_id = any(array$1) limit 15 offset $2",
      [blocked_users, offset]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
    });
  };