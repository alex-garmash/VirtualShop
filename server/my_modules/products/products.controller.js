const express = require('express');
const router = express.Router();
module.exports = router;


const productModel = require('./products.model');
const categoryModel = require('../categories/categories.model');
// logged check middleware
const checkAuth = require('../jwt_middleware');
// path
const path = require('path');
// multer
const multer = require('multer');
// file system
const fs = require('fs');
// file name of picture
let imageFileName;
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        imageFileName = (file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, imageFileName);
    }
});

//Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('url_img');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        // cb('Error: Images Only!');
        cb({fileType: 'Images Only! jpeg,jpg,png,gif'});
    }
}


/*
    api routes
*/
router.get('/search/:name', checkAuth, searchProducts);
router.get('/totalproducts', getTotalProducts);
router.get('/name/:name', checkAuth, getProductByName);
router.get('/id/:id', checkAuth, getProductById);
router.get('', checkAuth, getAllProducts);
router.post('',checkAuth,upload, createProduct);
router.put('',checkAuth,upload, updateProduct);


/*
    function search Products by key that includes in product name from DB.
 */
async function searchProducts(req, res) {
    try {
        if (!req.params.name) {
            throw "Missing product name";
        }

            let answer = [];
            let products = await productModel.getAll();
            if (products != null) {
                for (let product of products) {
                    if ((product.name.toLowerCase().indexOf(req.params.name.toLowerCase())) !== -1) {
                        answer.push(product);
                    }
                }
            }
            res.json(answer);
    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}

/*
    function get count of all Products from DB.
 */
async function getTotalProducts(req, res) {
    try {
        let count = await productModel.getTotalProducs();
        res.json(count);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
/*
    function get all Products from DB.
 */
async function getAllProducts(req, res) {
    try {
        let products = await productModel.getAll();
        res.json(products);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}

/*
    function get  Products by  id.
 */
async function getProductById(req, res) {
    try {
        if (!req.params.id) {
            throw "Missing product id";
        }

        let product = await productModel.getOneByID(req.params.id);
        res.json(product);
    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}

/*
    function get  Products by  category name.
 */
async function getProductByName(req, res) {
    try {
        if (!req.params.name) {
            throw "Missing product name";
        }
        if (req.params.name === 'All') {
            let products = await productModel.getAll();
            res.json(products);
        }
        else {
            let answer = [];
            let products = await productModel.getProductsByCategoryName(req.params.name);
            if (products != null) {
                for (let product of products) {
                    if (product.category.name === req.params.name) {
                        answer.push(product);
                    }
                }
            }
            res.json(answer);
        }

    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}

/*
    function create Product.
 */
async function createProduct(req, res) {
    try {
        // if(req.uploadImageError) {
        //     throw req.uploadImageError;
        // }
        let product = JSON.parse(req.body.product);
        if (!product.name && !product.price && !product.category) {
            throw "Missing data";
        }
        let obj = {
            name: product.name,
            price: product.price,
            url_img: imageFileName
        };

        let categoryId = await categoryModel.getOrCreateCategory({name: product.category});
        obj.category = categoryId._id;
        let newProduct = await productModel.create(obj);
        res.json(newProduct);

    } catch (e) {
        console.log('Create Product Error', e);
        res.status(403).end();
    }
}

/*
    function update Product.
 */
async function updateProduct(req, res) {
    try {
        let product = JSON.parse(req.body.product);
        if (!product._id && !product.name && !product.price && !product.category) {
            throw "Missing data";
        }
        if(imageFileName != product.url_img){
           try {
               fs.unlinkSync(`./uploads/${product.url_img}`);
           }catch (e) {
               console.log(e);
           }
        }
        let obj = {
            _id: product.id,
            name: product.name,
            price: product.price,
            url_img: imageFileName,
            category: product.category._id
        };

        await categoryModel.update(product.category);
        let updateProduct = await productModel.update(obj);
        res.json(updateProduct);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}