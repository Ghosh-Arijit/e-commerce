const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        minlength: 4,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return "Email is invalid"
            }
        }
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 128,
        required: true
    },
    tokens: [{
        token: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    roles: {
        type: [String],
        default: 'customer'
    },
    allowAccess: {
        type: Boolean,
        default: true
    },
    cartItems: [{
        product: {
            type: Schema.Types.ObjectId, 
            ref: 'Product'
        }, 
        quantity: {
            type: Number
        }
    }],
    addresses: [{
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }, 
        pincode: {
            type: Number,
            required: true
        }
    }],
    wishlists: [{ 
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    }]
})

//before saving
userSchema.pre("save",function(next){
    const user = this
    if(user.isNew){
        function encryptPassword(){
            return bcrypt.genSalt(10)
                .then(function(salt){
                    return bcrypt.hash(user.password,salt)
                        .then(function(encPass){
                            user.password = encPass
                        })
                })
        }
        function setRole(){
            return User.countDocuments()
                .then(function(count){
                    if(count == 0){
                        user.roles = ["admin"]
                    }
                })
        }
        return Promise.all([encryptPassword(),setRole()])
            .then(function(values){
                next()
            })
            .catch(function(err){
                return Promise.reject(err.message)
            })
    }else{
        next()
    }
})

//staic methods
userSchema.statics.findByCredentials = function(username_email,password) {
    const User = this
    return User.findOne({$or:[{email: username_email},{username: username_email}]})
            .then(function(user){
                if(!user){
                    return Promise.reject("invalid email/username")
                }
                else{
                    return bcrypt.compare(password,user.password)
                        .then(function(result){
                            if(!result){
                                return Promise.reject("invalid password")
                            }else{                                
                                if(user.allowAccess){
                                    return Promise.resolve(user)
                                }else{
                                    return Promise.reject("access denied")
                                }
                            }
                        })
                }                
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

userSchema.statics.findByToken = function(token) {
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token,"jwt@123")
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        "tokens.token": token
    })
}

//instance methods
userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        _id: user.id,
        username: user.username,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData,"jwt@123")
    user.tokens.push({
        token
    })
    return user.save()
        .then(function(user){
            return Promise.resolve(token)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}

const User = mongoose.model("User",userSchema)
module.exports = {
    User
}