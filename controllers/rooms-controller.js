const RoomService = require("../services/room-service")
const RoomDto = require("../dto/room-dto")




class RoomsController{

    index = async (req, res) => {
        const rooms = await RoomService.getAllRooms(["open"]);
        const allRooms = rooms.map(room => new RoomDto(room))
        return res.json(allRooms)
    }

    create = async (req, res) => {
        const {topic, roomType} = req.body;

        if(!topic || !roomType){
            return res.status(400).json({message : "All fields are required"})
        }

        const room = await RoomService.create({
            topic,
            roomType,
            ownerId : req.user._id
        })

        return res.json(new RoomDto(room));

    }

    show = async (req, res) => {
        const room = await RoomService.getRoom(req.params.roomId)
        return res.json(room);
    }

    search = async (req, res) => {
        const query = req.body.topic.toLowerCase();
        console.log(query)
        const room = await RoomService.searchRoom(query)
        return res.json(room);
    }



}

module.exports = new RoomsController();