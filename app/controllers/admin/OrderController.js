const express= require("express")
const _= require("lodash")
const router= express.Router()

const { Order }= require("../../models/Order")

const { userAuth } = require("../../middlewares/auth")
const { adminAccess, modAccess }= require("../../middlewares/access")

//localhost:3000/admin/orders/:id
router.put("/:id",userAuth,modAccess,function(req,res){
    const id= req.params.id
    const body= _.pick(req.body,["orderDate","address","total","status","orderItems"])
    Order.findOneAndUpdate({_id: id},body, {new:true, runValidators: true})
        .then(function(order){
            res.send({
                order,
                notice: "Order successfully updated"
            })
        })
        .catch(function(err){
            res.send({
                err,
                notice: "Failed to update order"
            })
        })
})

//localhost:3000/admin/orders/:id
router.delete("/:id",userAuth,adminAccess,function(req,res){
    const id= req.params.id
    Order.findByIdAndDelete(id)
        .then(function(order){
            if(order){
                res.send({
                    order,
                    notice: "Order deleted successfully"
                })
            }else{
                res.status("404").send({
                    notice: "order details not found"
                })
            }
        })
        .catch(function(err){
            res.send({
                err,
                notice: "Failed to delete"
            })
        })
})

module.exports={
    adminOrderRouter: router
}