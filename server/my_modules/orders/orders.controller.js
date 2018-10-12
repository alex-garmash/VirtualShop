const express = require('express');
const router = express.Router();
module.exports = router;

const orderModel = require('./orders.model');
// logged check middleware
const checkAuth = require('../jwt_middleware');

/*
    api routes
*/
router.get('/user/:id', checkAuth, getOrdersByUserID);
router.get('/totalorders', getTotalOrders);
router.get('/dates', checkAuth, getOrdersDates);
router.post('', checkAuth, createOrder);


/*
    function get all Orders dates from DB.
 */
async function getOrdersDates(req, res) {
    try {
        let ordersDates = await orderModel.getAllOrdersDates();
        res.json(ordersDates);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
/*
    function get total Orders from DB.
 */
async function getTotalOrders(req, res) {
    try {
        let count = await orderModel.getTotalOrders();
        res.json(count);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
/*
    function return all user orders
 */
async function getOrdersByUserID(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing id";
        }
        let answer = [];
        let orders = await orderModel.getAll();
        if (orders != null) {
            for (let order of orders) {
                if (order.shopping_cart.user._id == req.params.id) {
                    answer.push(order);
                }
            }
        }
        if(answer.length == 0){
            res.json(null);
        }else {
            res.json(answer);
        }

    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
/*
    function return new Order.
 */
async function createOrder(req, res) {
    try {
        if (!req.body.shopping_cart && !req.body.total_amount && !req.body.send_date  && !req.body.credit_card) {
            throw "Missing data";
        }
        let obj = {
            shopping_cart: req.body.shopping_cart,
            total_amount: req.body.total_amount,
            send_date: req.body.send_date,
            credit_card: req.body.credit_card

        };
        let newOrder = await orderModel.create(obj);
        let order = {
            shopping_cart: newOrder.shopping_cart,
            total_amount: newOrder.total_amount,
            send_date: newOrder.send_date,
            ordered_date: newOrder.ordered_date
        };
        res.json(order);

    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}
