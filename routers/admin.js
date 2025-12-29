const {Router} = require("express");
const bcrypt = require("bcrypt");
const {z} = require("zod");
const jwt = require("jsonwebtoken")

const { AdminModel, CourseModel } = require("../db");
const { adminMiddlware } = require("../middlewares/admin");

const adminRouter = Router();

adminRouter.post("/signup", async  (req, res) => {
    //zod validation
    const requiredBody = z.object({
        email: z.string().min(3).max(30).email(),
        password: z.string().min(3).max(12),
        name: z.string().min(3).max(50)
    })

    
    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success) {
        return res.json({
            message: "Incorrect format",
            error: parsedData.error
        })
        
    }

    const { email, password, name} = req.body;

    const existingUser =await AdminModel.findOne({email});

    if(existingUser) {
        return res.status(409).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await AdminModel.create({
        name,
        email,
        password: hashedPassword
    })


    res.json({
        message: "You're signed up!"
    })
})

adminRouter.post("/signin", async (req, res) => {

    const {email, password} = req.body;

    const admin = await AdminModel.findOne({email});

    if(!admin) {
        return res.json({
            message: "Admin doesn't exist in db"
        })
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if(!passwordMatch) {
        res.json({message: "Incorrect password"});
        return
    }

    const token = jwt.sign({
        id: admin._id.toString()
    }, process.env.JWT_ADMIN_SECRET)

        
    res.json({
        token
    })
})


//creating the courses
adminRouter.post("/course", adminMiddlware, async (req, res) => {
    const adminId= req.userId

    const {  title, description, imageUrl, price } = req.body;

    const course = await CourseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: adminId
    })
    res.json({
        message: "Course created",
        courseId: course._id
    })
})

//fetching all the courses

adminRouter.get("/course", adminMiddlware, async (req, res) => {
    const adminId = req.userId;

    const courses = await CourseModel.find({
        creatorId: adminId
    })

    res.json({
        courses
    })
})

adminRouter.put("/course/:courseId", adminMiddlware, async (req, res) => {
    const adminId = req.userId;
    const { courseId } = req.params;

    const {title, description, imageUrl, price } = req.body;

    const course = await CourseModel.findById(courseId);

    if(!course) {
        return res.status(404).json({
            message: "Course not found"
        })
    }

    if(course.creatorId.toString() !== adminId) {
        return res.status(403).json({
            message: "You can't update this course"
        })
    }

    //update the course
    const updatedCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        { title, description, imageUrl, price },
        {new: true}, //returns the updated course
    )

    res.json({
        message: "Course updated",
        course: updatedCourse
    })
})

//deleting the course

adminRouter.delete("/course/:courseId", adminMiddlware, async (req, res) => {
    const adminId = req.userId;
    const {courseId} = req.params;

    const course = await CourseModel.findById(courseId);

    if(!course) {
        res.json({message: "No course found"});
    }

    if(course.creatorId.toString() !== adminId) {
        return res.json({message: "You can't delete this course"})
    }

    await CourseModel.findByIdAndDelete(courseId);

    res.json({message: "Course deleted"});
})



module.exports = {
    adminRouter
}