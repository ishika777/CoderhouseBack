const User = require("../models/user-model")

class UserService{

    findUser = async (filter) => {
        const user = await User.findOne(filter);
        return user;
    }

    createUser = async (data) => {
        const user = await User.create(data);
        return user;
    }

    updateUser = async (data) => {
        const {userId,isActivated, name, avatar} = data;
        const user = await User.findById(userId);
        user.isActivated = isActivated;
        user.name = name;
        user.avatar = avatar;
        await user.save();
        console.log("donee")

        return user;
    }
}

module.exports = new UserService();