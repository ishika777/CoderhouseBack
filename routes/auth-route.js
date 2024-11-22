const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller")
const ActivateController = require("../controllers/activate-controller")
const authMiddleware = require("../middlewares/auth-middleware");
const RoomsController = require("../controllers/rooms-controller")




router.post("/api/send-otp-phone", AuthController.sendOtpPhone)

router.post("/api/send-otp-email", AuthController.sendOtpEmail)

router.post("/api/verify-otp", AuthController.verifyOtp)

router.post("/api/activate", authMiddleware, ActivateController.activate)

router.get("/api/refresh", AuthController.refresh);

router.post("/api/logout", authMiddleware, AuthController.logout);

router.post("/api/rooms", authMiddleware, RoomsController.create);

router.get("/api/rooms", authMiddleware, RoomsController.index);

router.get("/api/rooms/:roomId", authMiddleware, RoomsController.show);

router.post("/api/room/search", authMiddleware, RoomsController.search);


module.exports = router;