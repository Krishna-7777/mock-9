const mongoose=require("mongoose")

const schema=mongoose.Schema({
    user: String,
    text: String,
    image: String,
    createdAt: Date,
    likes: [String],
    comments: [{
      user: String,
      text: String,
      createdAt: Date
    }]
  })

const PostModel=mongoose.model("posts",schema)

module.exports={
    PostModel
}