const {Router} = require("express");

const courseRouter = Router();

courseRouter.post("/purchase", (req, res) => {
    res.json({message: "User purchased a course"})
})

courseRouter.get("/preview", (req, res) => {
    res.json("Preview of all courses")
})

module.exports = {
    courseRouter
}