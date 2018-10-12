const Product = require('./products.schema');

module.exports = {
    getAll: () => {
        return Product.find({}).populate('category', 'name');
    },
    create: (Obj) => {
        let product = new Product(Obj);
        return product.save();
    },
    getOneByID: (id) => {
        return Product.findById({_id: id}).populate('category');
    },
    getProductsByCategoryName: () => {
        return Product.find({}).populate('category');
    },
    update: (Obj) => {
        // let product = new Product(Obj);
        return Product.findOneAndUpdate({_id: Obj._id}, Obj,{upsert: true});
    },
    getTotalProducs : () => {
        return Product.countDocuments({});
    }
};