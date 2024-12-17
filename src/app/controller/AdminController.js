const { multiMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const Room = require("../models/Room");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

class AdminController {
  checkAdmin(req, res, next) {
    if (req.session.isAdmin) {
      next(); // Cho phép truy cập nếu đã xác nhận admin
    } else {
      res.redirect("/local/admin-login"); // Chuyển đến trang nhập mã
    }
  }

  getAdminLogin(req, res) {
    res.send(`
          <form method="POST" action="/local/admin-login">
            <label for="key">Admin Key:</label>
            <input type="password" id="key" name="key" required />
            <button type="submit">Submit</button>
          </form>
        `);
  }

  loginAdmin(req, res) {
    const { key } = req.body;
    if (key === "admin") {
      req.session.isAdmin = true; // Gán trạng thái admin
      res.redirect("/local/admin"); // Chuyển đến trang admin
    } else {
      res.status(401).send("Mã bảo mật không chính xác");
    }
  }
  getAdmin(req, res) {
    res.send("<h1>Quản lý phòng đã đặt</h1>");
  }
}

module.exports = new AdminController();
