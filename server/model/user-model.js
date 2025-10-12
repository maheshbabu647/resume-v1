import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    userPassword: {
        type: String,
        required: false,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true ,
    },
    linkedinId: { 
        type: String,
        unique: true,
        sparse: true
    },
    userRole: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: undefined
    },
    verificationCodeExpires: {
        type: Date,
        default: undefined
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const userModel = mongoose.model('User', userSchema)

export default userModel
