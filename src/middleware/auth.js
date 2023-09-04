const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next)=>{
    const { userToken } = req.body;
    if(!userToken){
        return next(new ErrorHandler("Please Login to access this resource",401));
    };
    const decodedData = jwt.verify(userToken, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id)
    next();
});

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.body.role)){
           next(new ErrorHandler(`Role: ${req.body.role} is not allowed to access this resource`, 403));
        };
        next();
    }
}