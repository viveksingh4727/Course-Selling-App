const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { courseRouter } =  require("./routers/course");
const { userRouter } = require ("./routers/user");
const {adminRouter} = require("./routers/admin")


const app = express();

dotenv.config();

app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/admin", adminRouter)


const main = () => {
    mongoose.connect(process.env.MONGO_URI)
    app.listen(3000);
    console.log("db connected");
}

main()




