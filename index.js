import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "./models/admin.js";
import Student from "./models/students.js";
import SubAdmin from "./models/sub-admin.js";

const app = express();
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get("/", (req, res)=>{
    res.send("Hello there");
})

app.post("/register/student", async(req, res)=>{
    const {
        username, 
        password,
        address,
        roll_no,
        branch,
        name, 
        phone_no,
        ver_data,
        email,
    } = req.body;
    try{
        const user = await Student.findOne({username});
        if(user)
            return res.status(403).json({message: "User already exists"});
        const hshdpwd = await bcrypt.hash(password, 12);
        await Student.create({
            username, 
            password: hshdpwd, 
            name,
            email,
            phoneNumber: phone_no,
            rollNumber: roll_no,
            address,
            branch,
            verificationData: ver_data, 
        })
        await Admin.updateOne({username: "Abhishek274"}, {$push: {studentRequests: {
            username, 
            name,
            email,
            phoneNumber: phone_no,
            rollNumber: roll_no,
            address,
            branch,
            verificationData: ver_data, 
        }}});
        res.status(200).json({message: "User registered"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong!"});
    }
})

app.post("/register/subAdmin", async(req, res)=>{
    const {
        username, 
        password,
        address,
        department,
        reference_no,
        name, 
        phone_no,
        email,
    } = req.body;
    try{
        const user = await SubAdmin.findOne({username});
        if(user)
            return res.status(403).json({message: "User already exists"});
        const hshdpwd = await bcrypt.hash(password, 12);
        await SubAdmin.create({
            username, 
            password: hshdpwd, 
            name,
            email,
            phoneNumber: phone_no,
            address,
            department,
            referenceNumber: reference_no
        })
        await Admin.updateOne({username: "Abhishek274"}, {$push: {subAdminRequests: {
            username, 
            name,
            email,
            phoneNumber: phone_no,
            address,
            department,
            referenceNumber: reference_no
        }}});
        res.status(200).json({message: "User registered"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong!"});
    }
});

// (async(req, res)=>{
//     const hshdpwd = await bcrypt.hash("12345678", 12);
//     await Admin.create({username: "Abhishek274", password: hshdpwd});
// })()   

app.post("/login/student", async(req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await Student.findOne({username}, "-_id -__v -verificationData");
        if(!user)
            return res.status(404).json({message: "User does not exist"});
        const isPwdCorrect =  await bcrypt.compare(password, user.password);
        if(!isPwdCorrect)
            return res.status(403).json({message: "Invalid credentials"});
        user.password = undefined;
        res.status(200).json(user); 
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong!"});
    }
})

app.post("/login/subAdmin", async(req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await SubAdmin.findOne({username}, "-_id -referenceNumber");
        if(!user)
            return res.status(404).json({message: "User does not exist"});
        const isPwdCorrect = await bcrypt.compare(password, user.password);
        if(!isPwdCorrect)
            return res.status(403).json({message: "Invalid credentials"});
        user.password = undefined;
        res.status(200).json(user); 
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong!"});
    }
})

app.post("/login/admin", async(req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await Admin.findOne({username}, "-_id");
        if(!user)
            return res.status(404).json({message: "User does not exist"});
        const isPwdCorrect = await bcrypt.compare(password, user.password);
        if(!isPwdCorrect)
            return res.status(403).json({message: "Invalid credentials"});
        user.password = undefined;
        res.status(200).json(user); 
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong!"});
    }
})

const conn = "mongodb+srv://Abhishek-admin:Tango_0range@cluster0.hsdpq.mongodb.net/PUMEET"
mongoose.connect(conn, { useNewUrlParser: true })
.then(()=>app.listen(8000, ()=>console.log(`Server started on port 8000`)))
.catch(error => console.log(error));
