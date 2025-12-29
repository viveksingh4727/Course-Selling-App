const mongoose = require("mongoose");
const { PureComponent } = require("react");

const {Schema, ObjectId} = mongoose;

const userSchema = new Schema({
    name: String,
    contactNo: Number,
    email: {type: String, require:true, unique:true},
    password: String,
})

const adminSchema = new Schema({
    name: String,
    email: {type: String, require:true},
    password: String,
})

const courseSchema = new Schema({
    title: String,
    price: Number,
    imageUrl: String,
    description: String,
    creatorId: ObjectId,
})

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
})


const UserModel = mongoose.model("user", userSchema);
const AdminModel = mongoose.model("admin", adminSchema);
const CourseModel = mongoose.model("course", courseSchema);
const PurchaseModel = mongoose.model("purchase", purchaseSchema);


module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}