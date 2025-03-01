const express=require('express');
const app=express();
const {User}=require('./model/User');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');



// connecting to the database
mongoose.connect('mongodb://127.0.0.1:27017/Shopify_ecom')
.then(()=>{
    console.log("Connected to the database");
}).catch((err)=>{
    console.log("database is not connected",err);
});


// middleware
app.use(express.json());

// task-1 create a register route
app.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        // check if field is missing
        if(!name || !email || !password){
            return res.status(400).json({message:"Some fields are missing"});
        }

        // check if user already exists
        const isUserAlreadyExists=await User.findOne({email});
        if(isUserAlreadyExists){
            return res.status(400).json({message:"User already exists"});
        }else{
            // hashing the password
            const salt=await bcrypt.genSaltSync(10);
            const hashedPassword=await bcrypt.hashSync(password,salt);

            // jwt token
            const token=jwt.sign({email},'supersecrete',{expiresIn:'365d'});

            // create a new user
            await User.create({
                name,
                email,
                password:hashedPassword,
                token,
                role:'user'
            })
        }
    }catch(err){

    }
});



const PORT=8080;

app.listen(PORT,()=>{
    console.log(`Server is connected to port ${PORT}`);
});