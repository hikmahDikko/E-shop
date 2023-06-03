const { mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
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

categorySchema.virtual('id').get(function () {
    return this._id;
});

categorySchema.set('toJSON', {
    virtuals : true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
