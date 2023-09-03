const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8, "Price cannot exceed 8 Characters"]
    },
    image: {type: String,required: true},
    category: {
        type: String,
        required: [true, "Please Enter Product category"]
    },
    location: {
        type: String,
        required: [true, "Please Enter Product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [4, "Stock cannot exceed 4 Characters"],
        default: 1
    },
    userId:{
        type: String,
        required: true
    },
    userName:{
     type: String,
     required: true,
    },
    userJoiningDate:{
        type: String,
        required: true,
       },
    userToken:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
       },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Product", productSchema);
