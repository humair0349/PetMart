const Product = require("../Models/ProductModel");
const ApiFeatures = require("../Utils/ApiFeatures");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Products --Admin 
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    // req.body.user = req.user.id;
    console.log(req.body)
    let url = req.file.filename;
    const product = await Product.create({
        image: url,
        ...req.body
    });
    res.status(201).json({
        success: true,
        product,
        // url
    })
});

// Get All Products 
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 10;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
    })
});

// Update Products --Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runvalidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
});

// Delete Products --Admin

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    product = await product.deleteOne({ _id: product._id });

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
        product
    })
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })

});

// Create New Review or Update the Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating),
            (rev.comment = comment)
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
        let avg  = 0;
        product.reviews.forEach(rev => {
            avg += rev.rating;
        });

        product.ratings  =  avg  / product.reviews.length;

        await product.save({validateBeforeSave: false});

        res.status(200).json({
            success: true
        });
});

// Get All Reviews of a Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() != req.query.id.toString());

    let avg  = 0;
    reviews.forEach(rev => {
        avg += rev.rating;
    });

    const ratings  =  avg  / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new: true,
        runvalidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
    });
});