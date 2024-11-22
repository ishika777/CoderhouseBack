class UserDto{
    id;
    field;
    name;
    avatar;
    activated;
    createdAt;

    constructor(user){
        this.id = user._id,
        this.field = user.field,
        this.name = user.name,
        this.avatar = user.avatar,
        this.activated = user.isActivated,
        this.createdAt = user.createdAt
    }
}

module.exports = UserDto;