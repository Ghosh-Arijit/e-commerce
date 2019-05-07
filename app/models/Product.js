const mongoose = require("mongoose")

const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    availableDateTime: {
        type: Date
    },
    codEligible: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        min: 0
    },
    image: {
        type: String
    }

})

const Product= mongoose.model("Product",productSchema)

module.exports= {
    Product
}
