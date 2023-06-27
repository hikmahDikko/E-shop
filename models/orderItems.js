const { mongoose } = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
    },
    quantity : {
        type : Number,
        default : 1
    }
})

orderItemsSchema.virtual('id').get(function () {
    return this._id;
});

orderItemsSchema.set('toJSON', {
    virtuals : true
});

const OrderItems = mongoose.model('OrderItem', orderItemsSchema);

module.exports = OrderItems;
