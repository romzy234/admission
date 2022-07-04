var mongoose = require('mongoose');

var applicantSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        unique: true,
        required:[true,'email is required']
    },
    department:{
        type:String,
        required:[true,'Department is required']
    }, 
    jambScore:{
        type:Number,
        required:[true,'Jamb is required']
    },
    dateOfBirth:{
        type:String,
        required:[true,'Date Of Birth is required']
    },
    result:{
        type:Array,
    },
    score:{
        type:Number,
    },
    stateOfOrigin:{
        type:String,
        required:[true,'Jamb is required']
    },
    gender:{
        type:String,
        required:[true,'Gender is required']
    },
    status:{
        type:String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('applicants',applicantSchema);