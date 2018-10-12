const express = require('express');
const router = express.Router();
module.exports = router;

const categoryModel = require('./categories.model');
// logged check middleware
const checkAuth = require('../jwt_middleware');




/*
    api routes
*/
router.get('/:id', checkAuth, getCategory);
router.get('', checkAuth, getAllCategories);
router.post('', checkAuth, createCategory);
router.put('/:id', checkAuth, updateCategory);

/*
    function get all Categories from DB.
 */
async function getAllCategories(req, res) {
    try {
        let categories = await categoryModel.getAll();
        res.json(categories);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}

/*
    function get one Category by ID.
 */
async function getCategory(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing id";
        }
        let category = await categoryModel.getOneByID(req.params.id);
        res.json(category);
    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}

/*
    function create Category.
 */
async function createCategory(req, res) {
    try {
        if(req.body.userData.role !== 'Administrator'){
            throw "Access denied ";
        }
        if (!req.body.name) {
            throw "Missing data";
        }

        let newCategory = await categoryModel.create({name : req.body.name});
        res.json(newCategory);

    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}

/*
    function update Category.
 */
async function updateCategory(req, res) {
    try {
        if(req.body.userData.role !== 'Administrator'){
            throw "Access denied ";
        }
        if(!req.params.id && !req.body.name){
            throw "Missing data";
        }
        let category = await categoryModel.update({_id: req.params.id, name: req.body.name});
        res.json(category);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}