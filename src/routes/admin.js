const express = require("express");
const router = express.Router();
const adminController = require("../app/controller/AdminController");

router.post("/admin-login", adminController.loginAdmin);
router.get("/admin-login", adminController.getAdminLogin);
router.get("/admin", adminController.checkAdmin, adminController.getAdmin);

module.exports = router;
