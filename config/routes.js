const express= require("express")
const router= express.Router()

//admin controllers
const { adminCategoryRouter }= require("../app/controllers/admin/CategoryController")
const { adminUserRouter }= require("../app/controllers/admin/UserController")
const { adminOrderRouter }= require("../app/controllers/admin/OrderController")
const { adminProductRouter }= require("../app/controllers/admin/ProductController")


//users controllers
const { userRouter }= require("../app/controllers/UserController")
const {categoryRouter }=require("../app/controllers/CategoryController")
const { productRouter }=require("../app/controllers/ProductController")
const { addressRouter }=require("../app/controllers/AddressController")
const { orderRouter }=require("../app/controllers/OrderController")
const { cartRouter }=require("../app/controllers/CartController")
const { wishlistsController }= require("../app/controllers/WishlistController")


//admin routes
router.use("/admin/categories", adminCategoryRouter)
router.use("/admin/users", adminUserRouter)
router.use("/admin/products", adminProductRouter)
router.use("/admin/orders", adminOrderRouter)

//users routes
router.use("/user",userRouter)
router.use("/categories", categoryRouter)
router.use("/products", productRouter)
router.use("/addresses" , addressRouter)
router.use("/orders", orderRouter)
router.use("/cart", cartRouter)
router.use("/wishlists", wishlistsController)



module.exports= {
    routes: router
}
