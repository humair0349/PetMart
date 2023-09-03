const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const { newOrder, myOrders, getAllOrders, updateOrder } = require('../Controllers/OrderController');


router.route("/order/new").post(
    // isAuthenticatedUser,
     newOrder);
router.route("/orders/me").get(
    // isAuthenticatedUser,
    myOrders
    );
router.route("/admin/orders").get(
    // isAuthenticatedUser, 
    authorizeRoles("admin"),
    getAllOrders
    );


router.route("/admin/order").put(
    // isAuthenticatedUser, 
    authorizeRoles("admin"),
    updateOrder);


module.exports = router;