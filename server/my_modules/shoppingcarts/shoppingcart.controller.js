const express = require('express');
const router = express.Router();
module.exports = router;

const shoppingCartModel = require('./shoppingcart.model');
// logged check middleware
const checkAuth = require('../jwt_middleware');


/*
    api routes
*/

router.post('/get/active', checkAuth, getActiveShoppingCartByUserID);
router.post('/get', checkAuth, getShoppingCartsByUserID);
router.post('', checkAuth, createShoppingCart);
router.put('/:id', updateShoppingCart);
router.delete('/:id', deleteShoppingCart);

/*
    function return all shopping cart of user
 */
async function getShoppingCartsByUserID(req, res) {
    try {
        if (!req.body.id) {
            throw 'Missing id';
        }
        let answer = [];
        let shoppingCarts = await shoppingCartModel.getAll();
        if (shoppingCarts != null) {
            for (let shoppingCart of shoppingCarts) {
                if (shoppingCart.user._id == req.body.id) {
                    answer.push(shoppingCart);
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
    function return active shopping cart of user
 */
async function getActiveShoppingCartByUserID(req, res) {
    try {
        if (!req.body.id) {
            throw 'Missing id';
        }
        let answer = {
            result: null
        };
        let shoppingCarts = await shoppingCartModel.getAll();

        if (shoppingCarts != null) {
            for (let shoppingCart of shoppingCarts) {
                if (shoppingCart.user._id == req.body.id && shoppingCart.active == true) {
                    answer.result = shoppingCart;
                    break;
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
    function create ShoppingCart.
 */
async function createShoppingCart(req, res) {
    try {
        if (!req.body.id) {
            throw "Missing data";
        }

        let newShoppingCart = await shoppingCartModel.create({user: req.body.id});
        res.json(newShoppingCart);

    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}
/*
    function update ShoppingCart.
 */
async function updateShoppingCart(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing id";
        }
        let obj = {
            _id: req.params.id,
            active: false
        };
        console.log('update shopping cart obj', obj);
        let updateShoppingCart = await shoppingCartModel.update(obj);
        res.json(updateShoppingCart);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
/*
    function delete ShoppingCart by ID from DB.
 */
async function deleteShoppingCart(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing id";
        }
        let deleteShoppingCart = await shoppingCartModel.delete(req.params.id);
        res.json(deleteShoppingCart);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
