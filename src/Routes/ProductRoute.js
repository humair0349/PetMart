const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../Controllers/ProductController');
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './pet_store/assets/images',
    filename: (req, file , cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage
})



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(
    // authorizeRoles("seller"),
    // isAuthenticatedUser,
    upload.single('image'),
    createProduct);
router.route("/admin/product/:id")
    .delete(
        // isAuthenticatedUser,
        // authorizeRoles("admin"),
         deleteProduct)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);
module.exports = router;