const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    street : {
        type : String,
        default : '',
    },
    apartment : {
        type : String,
        default : '',
    },
    city : {
        type : String,
        default : '',
    },
    zip: {
        type : String,
        default : '',
    },
    country : {
        type : String,
        default : '',
    },
    phone : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
});

userSchema.virtual('id').get(function ()  {
    return this._id;
});

userSchema.set('toJSON', {virtuals : true});

const User = mongoose.model('User', userSchema);

module.exports = User;