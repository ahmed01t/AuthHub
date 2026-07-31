import { Model } from "mongoose";
import mongoose
 from "mongoose";   
 import { Schema } from "mongoose";
 import bcrypt from "bcryptjs";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    
        email: {
            type: String,
            required: true,     
    },
username: {
        type: String,
        required: true,
},
password: {
        type: String,
        required: true,
        minlength: 6,
    },
    isemailverified: {
        type: Boolean,
        default: false,
    },
    emailverificationtoken: {
        type: String,
    },
    emailverificationtokenexpires: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpiresAt: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },
    role: { 
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: { 
        type: String,
    }
    
}, {timestamps:true})

userSchema.pre("save", async function () {
    if(this.isModified("password")){
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
})

const User = mongoose.model("User", userSchema);

export default User;
