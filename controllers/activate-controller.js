const OtpService = require("../services/otp-service")
const HashService = require("../services/hash-service");
const UserService = require("../services/user-service");
const TokenService = require("../services/token-service")
const ImageService = require("../services/image-service")
const User = require("../models/user-model")
const Refresh = require("../models/refresh-model")
const UserDto = require("../dto/user-dto");
const { Jimp } = require("jimp")
const path = require("path")


class ActivateController {

    activate = async (req, res) => {

        const userId = req.user._id;
        const { name, avatar } = req.body;
        if (!name || !avatar) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64");
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;


        try {
            const jimResp = await Jimp.read(buffer);
            await jimResp.resize({ w: 150, h: Jimp.AUTO }).write(path.resolve(__dirname, `../storage/${imagePath}`));
        } catch (error) {
            return res.status(500).json({ message: "Could not process image" });
        }

        try {
            const user = await UserService.findUser({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const upUser = await UserService.updateUser({ userId, isActivated: true, name, avatar: `/storage/${imagePath}` });

            return res.status(200).json({ user: new UserDto(upUser), auth: true });


        } catch (error) {
            return res.status(500).json({ message: "Something went wrong" });
        }
    };

}


module.exports = new ActivateController();