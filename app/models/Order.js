const mongoose = require("mongoose")
const { User }= require("../models/User")

const Schema = mongoose.Schema

const orderSchema = new Schema({
    orderDate: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    total: {
        type: Number
    },
    status: {
        type: String,
    },
    orderItems: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            min : 0
        },
        price: {
            type: Number,
            min: 0
        }
    }]
})

orderSchema.pre('save', function(next){
    const order = this
    order.total= 0
    order.orderItems = []
    User.findOne({_id: order.user}).populate('cartItems.product')
        .then(function(user){
            if(user.cartItems.length>0){
                user.cartItems.forEach(function(item){
                    order.orderItems.push({
                        product: item.product._id,
                        quantity:item.quantity,
                        price: item.product.price * item.quantity
                    })
                    order.total = order.total + (item.product.price * item.quantity)
                    order.status= "success"
                })
                next()
            }else{
                next()
            }
        })
        .catch(function(err){
            next()
        })

})

const Order= mongoose.model("Order",orderSchema)

module.exports= {
    Order
}