const {Router} = require("express");
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { UserModel, CourseModel, PurchaseModel } = require("../db");
const { userMiddleware } = require("../middlewares/user");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        name: z.string().min(3).max(20),
        contactNo: z.string().min(10).max(15),
        email: z.string().min(3).max(20).email(),
        password: z.string().min(5).max(10)
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success) {
        res.json({
            message: "Incorrect format",
            error: parsedData.error
        })
        return
    }

    const {name, contactNo, email, password} = req.body;

    const existingUser = await UserModel.findOne({email});
    if(existingUser) {
        res.json({message: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
        name,
        contactNo,
        email,
        password: hashedPassword,
        
    })
    res.json({message: "You're signed up!"})
})

userRouter.post("/signin", async (req, res) => {
    const { email, password} = req.body;

    const user = await UserModel.findOne({email});

    if(!user) {
        res.json({message: "User doesn't exist"});
        return
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
        res.json({message: "Incorrect password"});
        return
    }

    const token = jwt.sign({
        id: user._id.toString()
    }, process.env.JWT_USER_SECRET)

    res.json({token, 
        message: "You're signed in!"})
})

//fetching the user's courses
userRouter.get("/purchases", userMiddleware, async (req, res) => {

    const userId = req.userId;

    const purchases = await PurchaseModel.find({
        userId
    })

    const courseIds = purchases.map(p => p.courseId);

    const courses = await CourseModel.find({
        _id: {$in: courseIds}
    });




    res.json({courses, message: "All the purchased courses of user"})
})

//user purchasing a course

userRouter.post("/purchase/:courseId", userMiddleware, async (req, res) => {
    //check if course is already purchased by user
    //check if course exists or not
    //create purchase entry

    const userId= req.userId;
    const {courseId} = req.params;

    const exisitngCourse = await CourseModel.findById(courseId);

    if(exisitngCourse) {
        return res.status(403).json({message: "No course found"})
    }

    const alreadyPurchasedCourse = await PurchaseModel.findOne({
        userId,
        courseId
    })

    if(alreadyPurchasedCourse) {
        return res.status(409).json({
            message:"Course is already purchased"
        })
    }

    await PurchaseModel.create({
        userId,
        courseId
    })

    res.json({message:"Course purchased succesfully"
    })
})


module.exports = {
    userRouter
}