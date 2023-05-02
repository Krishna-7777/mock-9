const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PostModel } = require("../models/post.model");
require("dotenv").config()

const postRoutes = express.Router();

postRoutes.get('/', async (ask, give) => {
    try {
        let data = await PostModel.find()
        give.send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in getting all posts" })
    }
})

postRoutes.post('/', async (ask, give) => {
    try {
        let payload = ask.body
        payload.user = (await jwt.decode(ask.headers.authorization)).id
        payload.createdAt = new Date()
        let post = new PostModel(payload)
        post.save()
        give.status(201).send({ msg: "Post Created!" })
    } catch (error) {
        give.status(403).send({ msg: "Error in creating the post" })
    }
})

postRoutes.patch('/:id', async (ask, give) => {
    try {
        let payload = ask.body
        await PostModel.findByIdAndUpdate(ask.params.id, payload)
        give.status(204).send({ msg: "Post Updated!" })
    } catch (error) {
        give.status(403).send({ msg: "Error in updating the post" })
    }
})

postRoutes.delete('/:id', async (ask, give) => {
    try {
        await PostModel.findByIdAndDelete(ask.params.id)
        give.status(202).send({ msg: "Post Deleted!" })
    } catch (error) {
        give.status(403).send({ msg: "Error in deleting the post" })
    }
})

postRoutes.post('/:id/like', async (ask, give) => {
    try {
        let post = await PostModel.findById(ask.params.id)
        let userid = (await jwt.decode(ask.headers.authorization)).id
        if (!post.likes.includes(userid)) post.likes.push(userid)
        await PostModel.findByIdAndUpdate(ask.params.id, { likes: post.likes })
        give.status(201).send({ msg: "Post liked!" })
    } catch (error) {
        give.status(403).send({ msg: "Error in liking the post" })
    }
})

postRoutes.post('/:id/comment', async (ask, give) => {
    try {
        let comments = await PostModel.findById(ask.params.id)
        comments = comments.comments
        let payload = ask.body
        payload.createdAt = new Date()
        payload.user = (await jwt.decode(ask.headers.authorization)).id
        comments.push(payload)
        await PostModel.findByIdAndUpdate(ask.params.id, { comments })
        give.status(201).send({ msg: "Comment Added!" })
    } catch (error) {
        give.status(403).send({ msg: "Error in adding the comment" })
    }
})

postRoutes.get('/:id', async (ask, give) => {
    try {
        let data = await PostModel.findById(ask.params.id)
        give.send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in getting the post" })
    }
})

module.exports = {
    postRoutes
}