const express= require("express")
const _= require("lodash")
const router = express.Router()

const { User }= require("../models/User")
const { Order }= require("../models/Order")

const { userAuth } = require("../middlewares/auth")

//localhost:3000/orders
router.post("/",userAuth,function(req,res){
    const { user } = req
    const order = new Order() 
    order.user = user._id 
    order.address = user.addresses[0]

    order.save()
        .then(function(order){
            if(order.status == 'success'){
                User.findOneAndUpdate({_id: order.user},{ cartItems: [] })
                    .then(function(user){
                        res.send(order)
                    })
                    .catch(function(err){
                        res.send({
                            err,
                            notice: "failed to clear cart items"
                        })
                    })
            }else{
                res.send({})
            }       
        })
        .catch(function(err){
            res.send(err)
        })
})


//localhost:3000/orders
router.get("/",userAuth,function(req,res){
    Order.find()
        .then(function(orders){
            res.send(orders)
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports= {
    orderRouter: router
}