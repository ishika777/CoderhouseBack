const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    field : {
        type : String,
        required : true
    },
    isActivated : {
        type : Boolean,
        required : false,
        default : false
    },
    name : {
        type : String,
        required : false,
    },
    avatar : {
        type : String,
        required : false,
        get : (avatar) => {
            if(avatar){
                return `${process.env.BASE_URL}${avatar}`
            }
            return avatar;
        }
    }
}, {
    timestamps : true,
    toJSON : {
        getters : true
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;