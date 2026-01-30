import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("✅ Database connected successfully to:", process.env.MONGODB_URL)
    } catch (err) {
        console.error("❌ Database connection error:", err)
        process.exit(1); // Exit if DB connection fails
    }
}

export default connectDb;