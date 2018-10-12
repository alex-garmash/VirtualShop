const express = require('express');
const router = express.Router();
module.exports = router;

const userModel = require('./users.model');
// create web topken
const jwt = require('jsonwebtoken');
// bcrypt password controller
const pwd = require('../password_controller');


/*
    api routes
*/
router.post('/regAuth', checkIfEmailAndIDExist);
router.post('', createUser);


/*
    function create User.
 */
async function createUser(req, res) {
    try {

        if (!req.body.first_name && !req.body.last_name && !req.body.ID && !req.body.password && !req.body.email && !req.body.city && !req.body.street) {
            throw "Create user missing details";
        }
        let createUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                ID: req.body.ID,
                email: req.body.email,
                role: 'User',
                city: req.body.city,
                street: req.body.street
        };
        if(await userModel.byEmail(createUser.email) != null) {
            throw "Create user username exists";
        }
        createUser.hash = await pwd.hash(req.body.password);

        let newUser = await userModel.create(createUser);

        let result = {
            user: {
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                // street: newUser.street,
                // city: newUser.city,
                role: newUser.role
            }
        };

        result.token = jwt.sign(
            result.user,
            process.env.JWT_KEY, {
                expiresIn: "12h"
            }
        );
        res.json(result);

    } catch (e) {
        console.log(e);
        res.status(403).end();
    }
}


async function checkIfEmailAndIDExist(req, res) {
    try {
        if(!req.body.email && !req.body.ID){
            throw "Missing data";
        }
        let error = {
            email : false,
            ID : false
        };

        let answer = await userModel.checkIfEmailAndIDExist();
        for(let ans of answer){
            if(ans.email === req.body.email){
                error.email = true;
                // console.log('email find');
            }
            if(ans.ID === req.body.ID){
                error.ID = true;
                // console.log('ID find');
            }
        }
        res.json(error);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}

/*
    function get all Users from DB.
 */
// async function getUsers(req, res) {
//     try {
//         if((req.userData.role !== 'Administrator')){
//             res.status(403).send('You do not have permissions');
//         }
//         let users = await userModel.getAll();
//         res.json(users);
//     } catch (e) {
//         console.log(e);
//         res.status(400).send('bad request');
//     }
// }