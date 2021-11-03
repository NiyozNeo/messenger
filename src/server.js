const http = require("http");
const express = require("express");
const path = require("path");
const cookie = require("cookie-parser");

const config = require("./config/config")
const AuthMiddleware = require("./middlewares/auth");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const home = require("./controllers/home");
const sign = require("./controllers/sign");
const login = require("./controllers/login");
const user = require("./controllers/user");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(require("express-fileupload")());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(AuthMiddleware);

app.use("/public", express.static(path.join(__dirname, "uploads")));

app.get("/", home.GET);

app.get("/sign", sign.GET);
app.post("/sign", sign.POST);

app.get("/login", login.GET);
app.post("/login", login.POST);

app.get("/user/:username", user.GET);
app.post("/user", user.POST);

server.listen(config.PORT, () => {
    console.log(`Server started at http://localhost:${config.PORT}`);
});