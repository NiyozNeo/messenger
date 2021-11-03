const jwt = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    if (req.url !== "/login" && req.url !== "/sign") {
      const { access_token } = req.cookies;
      try {
        if(access_token) {
          var decoded = jwt.verify(access_token);
        if (decoded) {
          next();
        } else {
          res.status(403).redirect("/login");
        }
        } else {
          throw new Error("has no token")
        }
      } catch (error) {
        res.status(403).redirect("/login");
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(403).redirect("/login");
  }
};
