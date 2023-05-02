const mongoose=require("mongoose")

const schema=mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    bio: String,
    posts: [String],
    friends: [String],
    friendRequests: [String]
  })

const UserModel=mongoose.model("users",schema)

module.exports={
    UserModel
}