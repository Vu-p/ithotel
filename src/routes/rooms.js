const express = require("express");
const router = express.Router();
const roomController = require("../app/controller/RoomController");

router.post("/api/available-rooms", roomController.getAvailableRooms);
router.post("/create-order", roomController.createOrder);
router.get("/:id", roomController.showDetails);
router.get("/", roomController.show);

module.exports = router;
