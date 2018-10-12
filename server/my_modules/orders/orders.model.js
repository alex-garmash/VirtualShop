const Orders = require('./orders.schema');

module.exports = {
    getAll: () => {
       return Orders.find({},{'shopping_cart':'shopping_cart', 'total_amount':'total_amount', 'send_date':'send_date', 'ordered_date':'ordered_date'}).populate({
           path: 'shopping_cart',
           populate: {
               path: 'user',
               select: ['first_name', 'last_name', 'city', 'street']
           }
       });
    },
    getAllOrdersDates: () => {
        return Orders.find({},{'ordered_date' :'ordered_date','send_date': 'send_date'});
    },
    create: (Obj) => {
        let order = new Orders(Obj);
        return order.save();
    },
    getTotalOrders: () => {
        return Orders.countDocuments({});
    },
    getOneByID: (id) => {
        return Orders.findById({_id:id}, {'shopping_cart':'shopping_cart', 'total_amount':'total_amount', 'send_date':'send_date', 'ordered_date':'ordered_date'});
    }
};