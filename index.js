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
app.use(cors({
    origin: ['https://pu-meet.onrender.com',]
}));

var backendHtml = '\
        <html>\
        <link rel="preconnect" href="https://fonts.googleapis.com">\
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">\
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet">\
        <link rel="icon" type="image/x-icon" href="https://puchd.ac.in/asset/pu-logo.png">\
        <title>API PuMeet</title>\
            <body style="background-color:black; margin:0px; padding:0px; font-family: Josefin Sans, sans-serif;;\">\
                <div style="display: flex;\
                    justify-content: center;\
                    align-items: center;\
                    height: 100vh;\
                    margin:0px; padding:0px;\
                    width: 100vw;\
                    font-size: 50px;\
                    color: white;">\
                        <h1>pu</h1> <br> \
                        <h1>Meet</h1> \
                        &nbsp;<p style="font-size:50px;">API</p>\
                </div>\
            </body>\
        </html>\
';
app.get("/", (req, res)=>{
    res.send(backendHtml);
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

const PORT = process.env.PORT || 8000;

const conn = "mongodb+srv://Abhishek-admin:Tango_0range@cluster0.hsdpq.mongodb.net/PUMEET"
mongoose.connect(conn, { useNewUrlParser: true })
.then(()=>app.listen(PORT, ()=>console.log(`Server started on port 8000`)))
.catch(error => console.log(error));
