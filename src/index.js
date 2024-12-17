const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;
const handlebars = require("express-handlebars");
const path = require("path");
const session = require("express-session");

const route = require("./routes");
const db = require("./config/db");
//Connect to DB
db.connect();

const hbs = handlebars.create({
  extname: ".hbs",
  defaultLayout: "home",
  layoutsDir: path.join(__dirname, "resources", "views", "layouts"),
  helpers: {
    getFirstImage: function (images) {
      if (Array.isArray(images) && images.length > 0) {
        return images[0];
      }
      return "";
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("combined"));

app.use(
  session({
    secret: "web-cua-bo",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/favicon.ico", (req, res) => res.status(204).end());
route(app);

app.listen(port, () => console.log("Server is running on port: ", port));
