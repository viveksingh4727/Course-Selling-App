const {Router} = require("express");

const userRouter = Router();

userRouter.post("/user/signup", (req, res) => {
    res.json({message: "You're signed up!"})
})

userRouter.post("/user/signin", (req, res) => {
    res.json({message: "You're signed in!"})
})


userRouter.get("/user/purchases", (req, res) => {
    res.json({message: "All the purchased courses of user"})
})


module.exports = {
    userRouter
}