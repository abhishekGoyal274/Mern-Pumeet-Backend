import mongoose from "mongoose";

const subAdminSchema = mongoose.Schema({
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
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    phoneNumber:{
        type: String,
    },
    address: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        trim: true
    },
    referenceNumber: {
        type: String,
        trim: true
    }
});

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);
export default SubAdmin;