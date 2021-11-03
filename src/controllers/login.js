const jwt = require("../utils/jwt");
const io = require("../utils/db");

const GET = (_, res) => {
  res.render("login.ejs");
};

const POST = async (req, res) => {
  const { username, password } = req.body;
  const data = await io.read("database/posts.json");
  if (data.length) {
    const found = data.find((el) => {
      return el.username === username && el.password === password;
    });
    if (found) {
      const token = jwt.sign(found);
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.redirect("/");
    } else {
      res
        .status(404)
        .render("login.ejs", { message: "username or password incorrect" });
    }
  } else {
    res
      .status(403)
      .render("login.ejs", { message: "username or password incorrect" });
  }
};

module.exports = {
  GET,
  POST,
};
