const express=require("express")
const { connect } = require("./config/db")
const { userRoutes } = require("./routes/user.routes")
const { authenticate } = require("./middlewares/authenticate")
const { postRoutes } = require("./routes/posts.routes")

const app=express()

app.use(express.json())

app.get('/',async(ask,give)=>{
    give.send("Social Media App - Backend")
})

app.use('/api',userRoutes)

app.use(authenticate)
app.use('/api/posts',postRoutes)

app.listen(4000,()=>{
    try {
        connect
        console.log("Connected to the DB & Server is running at 4000...");
    } catch (error) {
        console.log("Error in connecting to the DB");
    }
})