import userCollection from "../Model/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JSON_WEB,
        {expiresIn: "7d"}
    )
}

export const signUp = async(req, res) => {
    const {name, email, password} = req.body;
    try{
        let user = await userCollection.findOne({email});
        if(user){
            return res.status(400).json({error: "User already exists"});
        }

        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new userCollection({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.json({
            _id : user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            jwt: generateToken(user._id),
            message: "User created successfully"
        })
    }  catch(err){
        res.status(400).json({message: err})
    }
}

export const signIn = async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await userCollection.findOne({email});
        if(!user){
            return res.status(400).json({error: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error: "Invalid credentials"});
        }

        res.json({
            _id : user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            jwt: generateToken(user._id),
            message: "User logged in successfully"
        })
    }  catch(err){
        res.status(400).json({message: err})
    }
}