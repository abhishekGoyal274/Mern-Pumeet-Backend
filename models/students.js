import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber:{
        type: String,
    },
    address: {
        type: String,
        trim: true,
    },
    rollNumber: {
        type: String,
        required: true,
        trim: true
    },
    branch: {
        type: String,
        trim: true,
    },
    verificationData: {
        type: String,
        required: true,
        trim: true
    }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;