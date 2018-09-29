const mongoose = require('mongoose');

const sizeSchema = mongoose.Schema({
    size:{
        required: true,
        type: String,
        unique: 1,
        maxlength:100
    }
});

const Size = mongoose.model('Size',sizeSchema);

module.exports = { Size }