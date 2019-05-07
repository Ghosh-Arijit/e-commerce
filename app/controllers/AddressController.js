const express = require("express")
const _=require("lodash")
const router = express.Router()

const { User }= require("../models/User") 

const { userAuth } = require("../middlewares/auth")

//localhost:3000/addresses
router.get("/",userAuth,function(req,res){
    const { user } = req
     if(user){
         res.send(user.addresses)
     }else{
         res.send({})
     }
 })
 
 //localhost:3000/addresses
 router.post("/",userAuth,
 function(req,res){
    const { user } = req
    const body = _.pick(req.body,["address","city","pincode"])
    User.findByIdAndUpdate(user._id,{$push: {addresses: body}}, {new: true, runValidators: true})
        .then(function(user){
            res.send(user.addresses)
        })
        .catch(function(err){
            res.send(err)
        })
})
 
 //localhost:3000/user/addresses/:id
 router.delete("/:id",userAuth,function(req,res){
     const { user } = req
     const id = req.params.id
     console.log(user)
     User.findByIdAndUpdate(user._id,{$pull:{addresses: {_id:id}}},{new:true}) 
        .then(function(user){
            res.send({
                addresses :user.addresses,
                notice : "Deleted Successfully"
            })
        })
        .catch(function(err){
            res.send(err)
        })
 })

 //localhost:3000/user/addresses/:id
 router.put("/:id",userAuth,function(req,res){
     const id = req.params.id
     const body= _.pick(req.body,["address","city","pincode"])
     User.findOneAndUpdate({"addresses._id":id},{$set: 
        {"addresses.$.address": body.address,
         "addresses.$.city": body.city,
         "ddresses.$.pincode": body.pincode
        }}, {new: true, runValidators: true})
        .then(function(user){
            res.send({
                addresses: user.addresses,
                notice: "Updation Successful"
            })
        })
        .catch(function(err){
            res.send(err)
        })

 })
 
 module.exports = {
     addressRouter : router
 }