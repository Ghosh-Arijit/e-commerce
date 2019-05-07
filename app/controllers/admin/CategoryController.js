const express= require("express")
const _= require("lodash")
const router= express.Router()

const { Category }= require("../../models/Category")

const { userAuth } = require("../../middlewares/auth")
const { adminAccess, modAccess }= require("../../middlewares/access")


//localhost:3000/admin/categories
router.get("/",userAuth,modAccess,function(req,res){
    Category.find()
        .then(function(categories){
            res.send(categories)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/categories/
router.post("/",userAuth,modAccess,function(req,res){
    const body= _.pick(req.body,["name"])
    const category= new Category(body)
    category.save()
        .then(function(category){
            res.send({
                category,
                notice: "Successfully created category"
            })
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/categories/:id
router.put("/:id",userAuth,modAccess,function(req,res){
    const id= req.params.id
    const body= _.pick(req.body, ["name"])
    Category.findOneAndUpdate({_id: id},body,{new: true, runValidators: true})
        .then(function(category){
            res.send({
                category,
                notice: "Successfully modified"
            })
        })
        .catch(function(err){
            res.send({
                err,
                notice: "Failed to modify"
            })
        })
})

//localhost:3000/admin/categories/:id
router.delete("/:id",userAuth,adminAccess,function(req,res){
    const id= req.params.id
    Category.findOneAndDelete({_id:id})
        .then(function(category){
            if(category){
                res.send({
                    category,
                    notice: "Successfully Deleted"
                })
            }else{
                res.status("404").send({
                    notice: "page not found"
                })
            }
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports= {
    adminCategoryRouter: router
}