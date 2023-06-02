const { default: mongoose } = require("mongoose");

const productShema = new mongoose.Schema({
    name : {
        type : 'string',
    },
    post : {
        type : 'string',
    }
})

const Product = mongoose.model('Products', productShema);

module.exports = Product;
