const { mongoose } = require("mongoose");

const categoryShema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    icon : {
        type : String,
    },
    color : {
        type : String,
    },
    dateCreated : {
        type : Number,
        default : Date.now(),
    }
})

const Category = mongoose.model('Category', categoryShema);

module.exports = Category;
