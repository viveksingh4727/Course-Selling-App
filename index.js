const express = require("express");

const app = express();

app.post("/user/signup", (req, res) => {
    res.json({message: "You're signed up!"})
})

app.post("/user/signin", (req, res) => {
    res.json({message: "You're signed in!"})
})


app.get("/user/purchases", (req, res) => {
    res.json({message: "All the purchased courses of user"})
})

app.post("/course/purchase", (req, res) => {
    res.json({message: "User purchased a course"})
})

app.get("/courses", (req, res) => {
    res.json("Preview of all courses")
})