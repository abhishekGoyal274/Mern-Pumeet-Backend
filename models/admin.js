import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
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
    studentRequests: {
        type: Array,
        default: []
    },
    subAdminRequests: {
        type: Array,
        default: []
    }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;