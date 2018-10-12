const Cart = require('./cartitem.schema');

module.exports = {

    getAll: () => {
        return Cart.find({})
            .populate({
                path: 'product',
                populate: {
                    path: 'category',
                    select: ['name']
                }
            })
            .populate({
            path: 'shopping_cart',
            populate: {
                path: 'user',
                select: ['_id','first_name','last_name','role']
            }
        });

    },
    findAllCartItemsFromActiveShoppingCartByUserID: () => {
        return Cart.find({})
            .populate({
                path: 'product',
                populate: {
                    path: 'category',
                    select: ['name']
                }
            })
            .populate({
                path: 'shopping_cart',
                populate: {
                    path: 'user',
                    select: ['_id','first_name','last_name','role']
                }
            });
    },
    create: (Obj) => {
        let newCart = new Cart(Obj);
        return newCart.save();
    },
    getOneByID: (id) => {
        return Cart.findById({_id: id});
    },
    delete: (id) => {
        return Cart.findByIdAndRemove({_id: id});
    }
};