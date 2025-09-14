import mongoose from "mongoose";

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        require: true,
        unique: true,
        length: {
            min: 6
        }
    }
})

export const User = mongoose.model("User", user);
