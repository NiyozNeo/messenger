const jwt = require("../utils/jwt");
const io = require("../utils/db");
const path = require("path");
const { v4: UUID } = require("uuid");

const GET = async (req, res) => {
  const { access_token } = req.cookies;
  var decoded = jwt.verify(access_token);

  const { username } = req.params;
  const data = await io.read(
    path.join(process.cwd(), "database", "posts.json")
  );
  const posts = await io.read(
    path.join(process.cwd(), "database", "post.json")
  );
  const found = data.find((user) => user.username === username);
  const postsFound = posts.filter((post) => post.username === username);
  
  if (decoded.username === username) {
    found.current = true;
    res.status(200).render("user.ejs", {found , postsFound});

  } else if (found) {
    found.current = false;
    res.status(200).render("user.ejs", {found , postsFound});
  } else {
    res.status(404).render("404.ejs");
  }
};

const POST = async (req, res) => {
  const { title } = req.body;
  const { poster } = req.files;
  const { access_token } = req.cookies;

  var decoded = jwt.verify(access_token);
  const newName = `${UUID()}.${poster.mimetype.split("/")[1]}`;

  poster.mv(path.join(process.cwd() + "/src/uploads/" + newName), (_) => {});

  const data = await io.read(
    path.join(process.cwd(), "database", "post.json")
  );
  let newPost = null
  const postId = data[data.length - 1]?.id + 1 || 0;
  if (poster.mimetype.split("/")[1] == "png" || poster.mimetype.split("/")[1] == "jpg") {
     newPost = {
      id: postId,
      username: decoded.username,
      title,
      poster: newName,
      type: true
    };   
  } else if (poster.mimetype.split("/")[1] == "mp4")  {
    newPost = {
      id: postId,
      username: decoded.username,
      title,
      poster: newName,
      type: false
    };
  }
if (!data.length) {
      await io.write(path.join(process.cwd(), "database", "post.json"), [
        newPost,
      ]);
    } else {
      data.push(newPost);
      await io.write(path.join(process.cwd(), "database", "post.json"), data);
    }
  res.status(200).redirect(`/user/${decoded.username}`);
};

module.exports = {
  GET,
  POST,
};
