const jwt = require("../utils/jwt");
const io = require("../utils/db")
const path = require("path")
const GET = async (req, res) => {
  const { access_token } = req.cookies;
  var decoded = jwt.verify(access_token);


  const data = await io.read(path.join(process.cwd(), "database" , "post.json"));  
  res.render("index.ejs",  { data ,decoded });
};

const POST = async (req, res) => {
  
};

module.exports = {
  GET,
  POST,
};
