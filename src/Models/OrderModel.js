const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
    },
    orderItems: {
            name: {type: String, required: true},
            price: {type: Number,required: true},
            quantity: {type: Number,required: true},
            image:{type: String, required: true},
            productId: {type: String, required: true},
        },
    userId:{type: String, required: true},
    paymentInfo: {type: String, required: true},
    itemsPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
    },
    deliveredAt: String,
    createAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("Order", orderSchema);