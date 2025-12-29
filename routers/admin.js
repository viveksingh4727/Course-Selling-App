const {Router} = require("express");

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
    res.json({
        message: "You're signed up!"
    })
})

adminRouter.post("/signin", (req, res) => {
    res.json({
        message: "You're signed in!"
    })
})

adminRouter.post("/course", (req, res) => {
    res.json({
        message: "Course created"
    })
})

module.eports = {
    adminRouter
}