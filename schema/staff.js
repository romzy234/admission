var mongoose = require('mongoose');

var staffSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'username is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('staff',staffSchema);