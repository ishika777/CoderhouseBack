const Room = require("../models/room-model")


class RoomService{

    getAllRooms = async(types) => {
        const rooms = await Room.find({roomType :{$in : types} }).populate("speakers").populate("ownerId").exec()
        return rooms;
    }

    create = async(payload) => {
        const {topic, roomType, ownerId} = payload;
        const room = await Room.create({
            topic,
            roomType,
            ownerId,
            speakers : [ownerId]
        })
        return room;
    }

    getRoom = async(roomId) => {
        const room = await Room.findOne({_id : roomId});
        return room;
    }

    searchRoom = async(query) => {
        console.log(query)
        let rooms = [];
        const all = await Room.find({}).populate("speakers");
        for(let i of all){
            if(i.topic.toLowerCase() === query){
                rooms.push(i)
            }
        }
        return rooms;
    }
}

module.exports = new RoomService();