const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../models/user.model");
const { authenticate } = require("../middlewares/authenticate");

const userRoutes = express.Router();

userRoutes.post('/register', async (ask, give) => {
    try {
        let payload = ask.body
        let userSearch = await UserModel.find({ email: payload.email })
        if (userSearch.length) {
            give.status(201).send({ msg: "You are already registered, Please Login!" })
        } else {
            let password = payload.password
            let hash = await bcrypt.hash(password, 2)
            payload.password = hash
            let user = new UserModel(payload)
            await user.save()
            give.status(201).send({ msg: "User Registration Succesfull!" })
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in Registration" })
    }
})

userRoutes.post('/login', async (ask, give) => {
    try {
        let payload = ask.body
        let user = await UserModel.find({ email: payload.email })
        if (user.length) {
            user = user[0]
            let res = await bcrypt.compare(payload.password, user.password)
            if (res) {
                let token = await jwt.sign({ id: user._id }, process.env.secret);
                give.status(201).send({ msg: "Login SuccesFull", token })
            } else {
                give.status(201).send({ msg: "Wrong Credentials!" })
            }
        } else {
            give.status(201).send({ msg: "Please Register First!" })
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in Registration" })
    }
})

userRoutes.get('/users', async (ask, give) => {
    try {
        let data = await UserModel.find()
        give.send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in fetching all users." })
    }
})

userRoutes.get('/users/:id/friends', async (ask, give) => {
    try {
        let data = await UserModel.findById(ask.params.id)
        let friends = []
        for (let id of data.friends) {
            friends.push(await UserModel.findById(id))
        }
        give.send(friends)
    } catch (error) {
        give.status(403).send({ msg: "Error in fetching the user's friends." })
    }
})

userRoutes.use(authenticate)

userRoutes.post('/users/:id/friends', async (ask, give) => {
    try {
        let fid = ask.params.id
        let userid = await jwt.decode(ask.headers.authorization)
        userid = userid.id
        let friendRequests = await UserModel.findById(fid)
        friendRequests = friendRequests.friendRequests
        if (friendRequests.includes(userid)) {
            give.status(201).send({ msg: "Friend Request is already present!" })
        } else {
            friendRequests.push(userid)
            await UserModel.findByIdAndUpdate(fid, { friendRequests })
            give.status(201).send({ msg: "Friend Request Sent!" })
        }
    } catch (error) {
        console.log(error)
        give.status(403).send({ msg: "Error in sending friend request." })
    }
})

userRoutes.patch('/users/:id/friends/:friendId', async (ask, give) => {
    let id = ask.params.id
    let fid = ask.params.friendId
    let { accept } = ask.body
    try {
        let user=await UserModel.findById(id)
        let friends=user.friends
        let friendRequests=user.friendRequests
        if (accept) {
            friends.push(fid);
            for(let i in friendRequests){
                if(friendRequests[i]==fid){
                    friendRequests.splice(i,1)
                    break;
                }
            }
            await UserModel.findByIdAndUpdate(id,{friends,friendRequests})
            give.status(204).send({msg:"Friend Request Accepted"})
        }else{
            for(let i in friendRequests){
                if(friendRequests[i]==fid){
                    friendRequests.splice(i,1)
                    break;
                }
            }
            await UserModel.findByIdAndUpdate(id,{friendRequests})
            give.status(204).send({msg:"Friend Request Declined"})
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in accepting/declining friend request." })
    }

})

module.exports = {
    userRoutes
}