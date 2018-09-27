const { User } = require('./../models/user');

let auth = (req,res,next) => { //next is to move forward or not - allowed
    var token = req.cookies.w_auth;

    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            isAuth: false,
            error: true
        });

        req.token = token;
        req.user = user;
        next(); // next is going to the auth route in server
    });
}

module.exports = {auth};