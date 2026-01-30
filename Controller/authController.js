import userCollection from "../Model/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
    if (!process.env.JSON_WEB) {
        console.error("❌ JSON_WEB secret is missing in .env!");
        throw new Error("Server configuration error: JWT secret is missing");
    }
    return jwt.sign(
        { id: id.toString() },
        process.env.JSON_WEB,
        { expiresIn: "7d" }
    )
}

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Signup attempt for:", email);
    try {
        let user = await userCollection.findOne({ email });
        if (user) {
            console.log("User already exists:", email);
            return res.status(400).json({ error: "User already exists" });
        }

        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10); // Reduced rounds for testing/speed
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new userCollection({
            name,
            email,
            password: hashedPassword,
        });

        console.log("Saving user to database...");
        await user.save();

        console.log("User saved, generating token...");
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            jwt: token,
            message: "User created successfully"
        })
    } catch (err) {
        console.error("SignUp Detailed Error:", err);
        res.status(500).json({
            message: "Server error during registration",
            error: err.message,
            stack: err.stack
        })
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            jwt: generateToken(user._id),
            message: "User logged in successfully"
        })
    } catch (err) {
        console.error("SignIn Error:", err);
        res.status(500).json({ message: "Server error during sign in", error: err.message })
    }
}