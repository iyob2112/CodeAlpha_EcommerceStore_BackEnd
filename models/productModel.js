// const mongoose = require('mongoose')

// const productSchema = mongoose.Schema({
//     productName : String,
//     brandName : String,
//     category : String,
//     productImage : [],
//     description : String,
//     price : Number,
//     sellingPrice : Number
// },{
//     timestamps : true
// })


// const productModel = mongoose.model("product",productSchema)

// module.exports = productModel

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    productImage: [{ type: String }],  // Assuming an array of image URLs
    description: { type: String },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
