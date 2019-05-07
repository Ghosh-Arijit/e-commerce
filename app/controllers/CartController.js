const express= require("express")
const _= require("lodash")
const router = express.Router()

const { User }= require("../models/User")

const { userAuth } = require("../middlewares/auth")

//localhost:3000/cart
router.get("/",userAuth,function(req,res){
    const { user }= req
    if(user){
        res.send(user.cartItems)
    }
    else{
        res.send({})
    }

})

//localhost:3000/cart
router.post("/",userAuth,function(req,res){
    const { user }= req
    const body = _.pick(req.body,["product","quantity"])
   // console.log(req)
    User.findByIdAndUpdate(user._id,{$push: {cartItems: body}}, {new: true, runValidators: true})
        .then(function(user){
            res.send(user.cartItems)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/cart/:id
router.put("/:id",userAuth,function(req,res){
    const id= req.params.id
    const body = _.pick(req.body,["quantity"])
    console.log(body)
    User.findOneAndUpdate({"cartItems._id": id}, {$set:
        {"cartItems.$.quantity": body.quantity}
    },{new: true, runValidators:true })
    .then(function(user){
        res.send({
           wishlist: user.cartItems,
           notice: "Updated"
        })
    })
    .catch(function(err){
        res.send(err)
    })
})

//localhost:3000/cart/:id
router.delete("/:id",userAuth,function(req,res){
    const { user} = req
    const id= req.params.id
    User.findByIdAndUpdate(user._id,{$pull: {cartItems:{_id:id}}},{new:true})
    .then(function(user){
        res.send(user.cartItems)
    })
    .catch(function(err){
        res.send(err)
    })
})


module.exports= {
    cartRouter: router
}