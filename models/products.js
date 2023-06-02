const { mongoose } = require("mongoose");

const productShema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    richDescription : {
        type : String,
        default : ''
    },
    image : {
        tupe : String,
    },
    images : [{
        type : String
    }],
    brand :{
        type : String,
    },
    price : {
        type : Number,
        default : 0
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    countInStock : {
        type : Number,
        required : true,
        min : 0,
        max : 255
    },rating : {
        type : Number,
        default : 0,
    },
    numReviews : {
        type : Number,
        default : 0,
    },
    isFeatured : {
        type : Boolean,
        default : false,
    },
    dateCreated : {
        type : Number,
        default : Date.now(),
    }
})

const Product = mongoose.model('Product', productShema);

module.exports = Product;
