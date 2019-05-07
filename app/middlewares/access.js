const adminAccess= (req,res,next)=>{
    if (req.user.roles.includes("admin")) {
        next()
    }else{
        res.status("403").send({
            notice: "the page does not exist"
        })
    }
}

const modAccess=(req,res,next)=>{
    if(req.user.roles.includes("moderator") || (req.user.roles.includes("admin")) ) {
        next()
    }else{
        res.status("403").send({
            notice: "the page does not exist"
        })

    }
}




module.exports= {
    adminAccess,
    modAccess
}