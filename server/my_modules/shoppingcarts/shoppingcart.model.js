const ShoppingCart = require('./shoppingcart.schema');

module.exports = {
    getAll: () => {
        return ShoppingCart.find({}).populate('user',['first_name', 'last_name', 'role']);
    },
    create: (Obj) => {
        let shoppingCart = new ShoppingCart(Obj);
        return shoppingCart.save();
    },
    getOneByID: (id) => {
        return ShoppingCart.findById({_id:id});
    },
    update: (Obj) => {
        //let updateShoppingCart = new ShoppingCart(Obj);
        return ShoppingCart.findOneAndUpdate({_id: Obj._id}, Obj,{upsert: true});
    },
    delete: (id) => {
        return ShoppingCart.remove({_id:id});
    }
};