const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticate = async (ask, give, next) => {
    let token = ask.headers.authorization;
    try {
        let decoded=jwt.verify(token,process.env.secret)
        next()
    } catch (error) {
        give.status(401).send({msg:"Not authorized!"})
    }
}

module.exports={
    authenticate
}