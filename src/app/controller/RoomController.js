const { multiMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const Room = require("../models/Room");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

class RoomController {
  show(req, res, next) {
    Room.find({})
      .then((rooms) => {
        res.render("rooms", {
          rooms: multiMongooseToObject(rooms),
        });
      })
      .catch(next);
  }

  showDetails(req, res, next) {
    // Log ID được truyền vào từ URL
    Room.findById(req.params.id)
      .then((room) => {
        res.render("room-detail", { room: mongooseToObject(room) });
      })
      .catch(next);
  }

  async saveCustomer(req, res, next) {
    try {
      const { name, phone } = req.body;

      // Kiểm tra nếu tên và số điện thoại không hợp lệ
      if (!name || !phone) {
        return res
          .status(400)
          .json({ message: "Tên và số điện thoại là bắt buộc" });
      }

      // Tạo đối tượng khách hàng mới
      const customer = new Customer({
        name,
        phone,
      });

      // Lưu khách hàng vào cơ sở dữ liệu
      await customer.save();

      // Trả về thông báo thành công
      res.status(201).json({ message: "Khách hàng đã được lưu thành công!" });
    } catch (error) {
      console.error("Error:", error);
      // Nếu có lỗi xảy ra, chuyển tiếp lỗi tới middleware xử lý lỗi
      next(error);
    }
  }

  async createOrder(req, res, next) {
    try {
      const { name, phone, roomId, checkIn, checkOut } = req.body;
      console.log(req.body);
      console.log({ name, phone, roomId, checkIn, checkOut });
      // Tạo một customer mới
      const customer = new Customer({
        name,
        phone,
        createAt: new Date(),
      });

      // Lưu thông tin khách hàng vào database
      await customer.save();

      // Tạo order mới
      const order = new Order({
        customerId: customer._id,
        roomId,
        checkIn,
        checkOut,
      });

      // Lưu order vào database
      await order.save();

      // Trả về response thành công
      res.json({ success: true, order });
    } catch (error) {
      console.error("Lỗi khi tạo order:", error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }

  async getAvailableRooms(req, res, next) {
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      return res
        .status(400)
        .json({ error: "Missing check-in or check-out time" });
    }

    try {
      // Chuyển đổi checkIn và checkOut sang đối tượng Date
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Lọc các phòng không bị đặt trong khoảng thời gian check-in và check-out
      const availableRooms = await Room.find({
        _id: {
          $nin: await Order.find({
            $or: [
              {
                checkIn: { $lt: checkOutDate }, // Kiểm tra xem có lịch đặt chồng lên không
                checkOut: { $gt: checkInDate },
              },
              {
                checkIn: { $gte: checkInDate, $lte: checkOutDate }, // Kiểm tra xem phòng đã có ai đặt trong khoảng đó chưa
              },
            ],
          }).distinct("roomId"), // Lấy các roomId đã bị đặt
        },
      });

      res.json({ rooms: availableRooms });
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new RoomController();
