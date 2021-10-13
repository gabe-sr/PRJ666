// Authentication
// to be called as middleware for protected routes

// Check if user is logged -> req.session.userInfo is not null
export const isLogged = (req, res, next) => {
  if (req.session.userInfo == null) {
    console.log(`USER ${req.params.id} IS NOT LOGGED IN`);
    return res.status(403).send({
      error: true,
      redirectTo: { url: `/` },
    });
  }

  next();
};

// Check if user is authenticated to access this resource
export const isAuthenticated = (req, res, next) => {
  if (req.session.userInfo.user_id != req.params.id) {
    console.log(`USER ${req.params.id} CAN'T ACCESS THIS RESOURCE`);
    return res.send({
      error: true,
      redirectTo: { url: `/user/${req.session.userInfo.user_id}` },
    });
  }

  next();
};

// const isAdmin = (req, res, next) => {
//   if (req.session.userInfo.type.toLowerCase() != "admin") {
//     res.redirect(`/user/404`);
//   } else {
//     //console.log(`Logged as ${req.session.userInfo.first_name} ADMIN!`);
//     next();
//   }
// };

// const isUser = (req, res, next) => {
//   if (req.session.userInfo.type.toLowerCase() != "user") {
//     res.redirect(`/user/404`);
//   } else {
//     //console.log(`Logged as ${req.session.userInfo.first_name} USER!`);
//     next();
//   }
// };

// const isLogged = (req, res, next) => {
//   const errors = [];
//   if (req.session.userInfo == null) {
//     errors.push(
//       "Sorry, you must be logged-in in order to book rooms! Please, login first."
//     );
//     res.render(`General/404`, {
//       errors: errors,
//     });
//   } else {
//     console.log(`Logged as ${req.session.userInfo.first_name} USER!`);
//     next();
//   }
// };
