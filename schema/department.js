var mongoose = require('mongoose');

var departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:true
    },
    jambScore:{
        type:Number,
        required:[true,'Jamb is required']
    },
    max_number:{
        type:Number,
        required:[true,'Limit is required']
    },
    applicant:{
        type:Number
    },
    wace:{
        type:Array,
    },
    hod:{
        type:String,
    },
    detail:{
        type:String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('departments',departmentSchema);