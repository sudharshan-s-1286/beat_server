import mongoose from'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDb = () => {
    try{
        mongoose.connect("mongodb://localhost:27017/ecommerce")
        console.log("Database connected")
    }catch(err){
        console.log(err)
    }
}

export default connectDb;