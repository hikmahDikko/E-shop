const { mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
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
        type : String,
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
    },
    rating : {
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
        type : String,
        default : Date.now(),
    }
})

productSchema.pre(/^find/, function(next){
    this.populate('category');
    next();
});

productSchema.virtual('id').get(function ()  {
    return this._id;
});

productSchema.set('toJSON', {virtuals : true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
