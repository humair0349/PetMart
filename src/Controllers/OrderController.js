const Order = require('../Models/OrderModel');
const Product = require("../Models/ProductModel");
const ApiFeatures = require("../Utils/ApiFeatures");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.newOrder = catchAsyncErrors(async (req, res, next)=>{
    console.log(req.body)

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        orderStatus,
        shippingPrice,
        totalPrice,
        userId
    } = req.body;
    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        orderStatus,
        totalPrice,
        paidAt: Date.now(),
        userId
        // user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get Single Ordr

// exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{
//     const order = await Order.findById(req.params.id).populate("user", "name email");

//     if(!order){
//         return next(new ErrorHandler("Order not Found with Id",404));
//     }

//     res.status(200).json({
//         success: true,
//         order
//     });
// });

// Get Logged in User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find({user: req.body._id});

    res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders (Admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update Order Status (Admin)
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.body.id);

    if (!order) {
        return next(new ErrorHandler("Order not Found with Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    // order.orderItems.forEach(async order => {
    //     await updateStock(order.product, order.quantity);
    // })

    order.orderStatus = req.body.status
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});