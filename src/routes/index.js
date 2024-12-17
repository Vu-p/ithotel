const roomRoute = require("./rooms");
const adminRoute = require("./admin");

function route(app) {
  app.use("/local", adminRoute);
  app.use("/", roomRoute);
}

module.exports = route;
