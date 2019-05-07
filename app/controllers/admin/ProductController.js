const express= require("express")
const _= require("lodash")
const multer= require("multer")
const router= express.Router()

const { Product }= require("../../models/Product")

const { userAuth } = require("../../middlewares/auth")
const { adminAccess, modAccess }= require("../../middlewares/access")

const storage= multer.diskStorage({
    //dest folder
    destination: function(req,file,cb){
        cb(null, "uploads")
    },
    //rename file
    filename: function(req,file,cb) {
        cb(null,Date.now() + '-' + file.originalname)
    }
})

const fileFilter= function(req,file,cb){
    if(file.mimetype== 'image/jpeg' || file.mimetype== 'image/png'){
        cb(null,true)
    }else {
        //null or new Error('message')
        cb(null,false)
    }
}

const upload= multer({
    storage,
    limits: {
        fileSize :1024 * 1024 * 5
    },
    fileFilter
})


//localhost:3000/admin/products?category=:id
router.post('/',userAuth,modAccess,upload.single('image'),function(req,res){
    const body= _.pick(req.body, ["name","price","description","availabeDateTime","stock"])
    body.image= req.file.filename
    body.category= req.query.category
    const product= new Product(body)
    product.save()
        .then(function(product){
            res.send({
                product,
                notice: "Successfully created"

            })
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/products/:id
router.put("/:id",userAuth,modAccess,upload.single('image'),function(req,res){
    const id= req.params.id
    const body= _.pick(req.body,["name","price","category","description","availabeDateTime","stock"])
    if(req.file){
        body.image= req.file.filename
    }
    Product.findOneAndUpdate({_id:id},body,{new: true, runValidators: true})
        .then(function(product){
            res.send({
                product,
                notice: "successfully updated"
            })
        })
        .catch(function(err){
            res.send({
                err,
                notice: "Failed to update"
            })
        })
})

//localhost:3000/admin/products/:id
router.delete("/:id",userAuth,adminAccess,function(req,res){
    const id= req.params.id
    Product.findOneAndDelete({_id:id})
        .then(function(product){
            if(product){
                res.send({
                    product,
                    notice: "Successfully deleted product"
                })
            }else {
                res.status("404").send({
                    notice: "product not found"
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

module.exports= {
    adminProductRouter: router
}
