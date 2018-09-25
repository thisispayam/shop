const mongoose = require('mongoose');

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

})

//creating a model out of this schema
const User = mongoose.model('User', userSchema);

module.exports = { User }