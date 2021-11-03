const path = require("path");
const jwt = require("../utils/jwt");
const GET = (_, res) => {
  res.render("sign.ejs");
};

const { v4: UUID } = require("uuid");
const io = require("../utils/db");

const POST = async (req, res) => {
  const { username, fname, lname, password } = req.body;
  const { poster } = req.files;

  const newName = `${UUID()}.${poster.mimetype.split("/")[1]}`;

  poster.mv(path.join(process.cwd() + "/src/uploads/" + newName), (_) => {});

  const data = await io.read("database/posts.json");
  const userId = data[data.length - 1]?.id + 1 || 0;
  const newUser = {
    id: userId,
    username,
    fname,
    lname,
    password,
    poster: newName,
  };
  if (!data.length) {
    io.write("database/posts.json", [newUser]);
  } else {
    data.push(newUser);
    io.write("database/posts.json", data);
  }
  const token = jwt.sign(newUser);
  res.cookie("access_token", token, {
    httpOnly: true,
  });
  res.redirect("/");
};

module.exports = {
  GET,
  POST,
};
