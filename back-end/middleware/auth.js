// Authentication
// to be called as middleware for protected routes

export const isAuthenticated = (req, res, next) => {
  console.log(req.params.id);
  if (req.session.userInfo == null) {
    return res.send("Not authorized!");
  } else if (req.session.userInfo.user_id != req.params.id) {
    return res.send("Can't access this user information");
  } else {
    console.log("Session created!");
    next();
  }
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
