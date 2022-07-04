var mongoose = require('mongoose');

var admissionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    applicant_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"applicant"
    },
    applicant_email :{
        type:String,
    },
    department:{
        type:String,
        required:[true,'department is required']
    },
    gradeCummlativeScore:{
        type:Number,
        required:[true,'isTrue is required']
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('admission',admissionSchema);