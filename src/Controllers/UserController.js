const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../Models/UserModel");
const sendToken = require("../Utils/jwtToken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password,role } = req.body;

    const user = await User.create({
        name, email, password,role,
    });
    sendToken(user, 201, res);
});

// Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email Or Password", 401));
    };

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email Or Password", 401));
    };

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} n\n\ If you have not  requested 
    this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Pet Mart`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} send successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message,500))
    }
});

// Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {    
    //Creating Token Hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });
    if(!user){
       return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    };
    if(req.body.password != req.body.confirmPassword){
       return next(new ErrorHandler("Password does not Match",400));
    };
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    sendToken(user,200,res);
});
// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req,res, next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
})

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {    

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    };
    if(req.body.newPassword != req.body.confirmPassword){
       return next(new ErrorHandler("Password does not Match",400));
    };
    user.password = req.body.newPassword;
    
    await user.save();
    sendToken(user,200,res);
});

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {    
   const newUserData = {
    name: req.body.name,
    email: req.body.email
   };
   // we will add cloudinary later
   const user = await User.findByIdAndUpdate(req.body.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
   });
   res.status(200).json({
    success: true,
    user
   });
});

// Get all Users (Admin)
exports.getAllUsers = catchAsyncErrors(async (req,res, next)=>{

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

// Get Single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req,res, next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Update User Role (Admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {    

    const newUserData = {
     name: req.body.name,
     email: req.body.email,
     role: req.body.role
    };
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
     new: true,
     runValidators: true,
     useFindAndModify: false
    });
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`),400)
    }
    res.status(200).json({
     success: true
    });
 });

 // delete User (Admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {    

    const user = await User.findById(req.params.id);
    // we will remove cloudinary later
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`),404)
    }
    await user.deleteOne({ _id: user._id });

    res.status(200).json({
        success: true,
        message: 'User Deleted successfully'
    });
 });