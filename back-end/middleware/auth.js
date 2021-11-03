// Authentication
// to be called as middleware for protected routes

// Check if user is logged -> req.session.userInfo is not null
export const isLogged = (req, res, next) => {
  if (req.session.userInfo == null) {
    return res.send({
      error: true,
      redirectTo: { url: `/` },
      type: "401",
    });
  }

  next();
};

// Check if user is authenticated to access this resource
export const isAuthenticated = (req, res, next) => {
  // for GET requests
  if (req.params.id) {
    if (req.session.userInfo.user_id != req.params.id) {
      console.log(req.session.userInfo.user_id);
      console.log(req.params.id);
      if (req.session.userInfo.isAdmin === true) {
        next();
      } else {
        return res.sendStatus(403);
      }
    } else {
      next();
    }
    // for POST requests
  } else {
    if (req.session.userInfo.user_id != req.body.user_id) {
      console.log(req.session.userInfo.user_id);
      console.log(req.body.user_id);
      if (req.session.userInfo.isAdmin === true) {
        next();
      } else {
        return res.sendStatus(403);
      }
    } else {
      next();
    }
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.userInfo.isAdmin === false) {
    return res.send({
      error: true,
      redirectTo: { url: `/user/${req.session.userInfo.user_id}` },
      type: "403",
    });
  }

  next();
};
