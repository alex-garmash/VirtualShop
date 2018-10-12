const express = require('express');
const router = express.Router();
module.exports = router;

const cartModel = require('./cartitem.model');
const shoppingCartsModel = require('../shoppingcarts/shoppingcart.model');
// logged check middleware
const checkAuth = require('../jwt_middleware');

/*
    api routes
*/

router.get('/:id', checkAuth, getCartItem);
router.post('/active', checkAuth, getCartItemsFromActiveShoppingCart);
router.post('', checkAuth, createCartItem);
router.delete('/:id', checkAuth, deleteCartItem);


/*
    function return all cart items from active shopping cart by user Id
 */
async function getCartItemsFromActiveShoppingCart(req, res) {
    try {
        if (!req.body.id) {
            throw "Missing id";
        }
        let answer = [];
        let carts = await cartModel.findAllCartItemsFromActiveShoppingCartByUserID();

        if (carts != null) {
            for (let cart of carts) {
                if (cart.shopping_cart.user._id == req.body.id && cart.shopping_cart.active == true) {
                    answer.push(cart);
                }
            }
        }
        res.json(answer);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
/*
    function return cart item by ID.
 */
async function getCartItem(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing id";
        }
        let cart = await cartModel.getOneByID(req.params.id);
        res.json(cart);
    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}
/*
    function return new Cart Item.
 */
async function createCartItem(req, res) {
    try {
        if (!req.body.product && !req.body.amount && !req.body.total_price && !req.body.user) {
            throw "Missing data";
        }

        let shoppingCarts = await shoppingCartsModel.getAll();
        let shoppingCartId = null;

        if(shoppingCarts === null){
            let newShoppingCart = await shoppingCartsModel.create({user: req.body.user});
            shoppingCartId = newShoppingCart._id;
        }else{
            for(let shoppingCart of shoppingCarts){
                if(shoppingCart.active === true){
                    shoppingCartId = shoppingCart._id;
                    break;
                }
            }
        }
        if(shoppingCartId === null){
            let newShoppingCart = await shoppingCartsModel.create({user: req.body.user});
            shoppingCartId = newShoppingCart._id;
        }
        let obj = {
            product: req.body.product,
            amount: req.body.amount,
            total_price: req.body.total_price,
            shopping_cart: shoppingCartId
        };

        let newCart = await cartModel.create(obj);
        res.json(newCart);
    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}
/*
    function delete Cart by ID from DB.
 */
async function deleteCartItem(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing id";
        }
        let cart = await cartModel.delete(req.params.id);
        res.json(cart);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
