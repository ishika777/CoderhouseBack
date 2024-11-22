const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    topic : {
        type : String,
        required : true
    },
    roomType : {
        type : String,
        required : true
    },
    ownerId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    speakers : {
        type : [{
            type : Schema.Types.ObjectId,
            ref : "User",
        }],
        required : false
    },
}, {
    timestamps : true
})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;