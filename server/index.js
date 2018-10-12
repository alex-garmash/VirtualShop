const express = require('express');
const app = express();
const PORT = 3000;



/* CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    }
    else {
        next();
    }
});

/* body parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* request dump debug */
app.use( (req,res,next)=> {
    if(req.originalUrl=='/favicon.ico') {
        next();
    }
    else {
        console.log('>',req.method,req.originalUrl);
        if(Object.entries(req.body).length) {
            console.log('Posted:');
            console.log(req.body);
            console.log("\n");
        }
        next();
    }
});

// mongoose
const mongoose = require('mongoose');

/* register to error and connect events before making connection */
mongoose.connection.on('error',(e) => console.log('Db Connect Error:',e));
mongoose.connection.on('connected',() => {
    console.log('Db Connected to:',mongoose.connection.name);
    // start server since db is properly connected
    app.listen(PORT, () => {
        console.log(`Node listening on localhost:${PORT}`);
    });
});

/* actually connect to db */
mongoose.connect('mongodb://localhost:27017/cart',{useNewUrlParser: true});

/* routing */
app.use('/api/uploads', express.static('uploads'));
app.use('/api/users',require('./my_modules/users/users.controller'));
app.use('/api/categories',require('./my_modules/categories/categories.controller'));
app.use('/api/products',require('./my_modules/products/products.controller'));
app.use('/api/shoppingcarts',require('./my_modules/shoppingcarts/shoppingcart.controller'));
app.use('/api/cartitems',require('./my_modules/cartitem/cartitem.controller'));
app.use('/api/orders',require('./my_modules/orders/orders.controller'));
app.use('/api/cities', require('./my_modules/cities/cities.controller'));
app.use('/api/login', require('./my_modules/login/login.controller'));


/* return error if got here with no valid route */
app.use('**', (req, res) => {
    console.log('Unknown request');
    res.status('404').send("404 Unknown Request");
});
