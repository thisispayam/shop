const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10; // needed for decrypting and default is 10

//creating the schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        required:true,
        minLength: 5
    },
    name:{
        type: String,
        required: true,
        maxLength:100
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 100
    },
    cart:{
        type:Array,
        default: []
    },
    history:{
        type:Array,
        default: []
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    }

});

userSchema.pre('save', function(next){
    var user = this; //this refers to userSchema

    if (user.isModified('password')) {
    //encrypting password
        bcrypt.genSalt(SALT_I, function(err, salt){
            if(err) return next(err); // moves forward to the next in line

            
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) return next(err);
                    user.password = hash;
                    next();
                });
            })
        }else {
            next();
        }
       
    });


//creating a model out of this schema
const User = mongoose.model('User', userSchema);

module.exports = { User }