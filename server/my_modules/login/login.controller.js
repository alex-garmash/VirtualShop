const express = require('express');
const router = express.Router();
module.exports = router;

const userModel = require('../users/users.model');
const pwd = require('../password_controller');
const jwt = require('jsonwebtoken');

router.post('', login);


async  function login(req, res) {
    try {
        if(!req.body.email && !req.body.password){
            throw "Missing data";
        }
        let result = {
            token: null
        };
        let foundUser = await userModel.byEmail(req.body.email);
        if (foundUser) {
            let verifiedPwd = await pwd.verify(req.body.password, foundUser.hash);
            if (verifiedPwd) {
                result.user = {
                    id: foundUser._id,
                    first_name: foundUser.first_name,
                    last_name : foundUser.last_name,
                    street: foundUser.street,
                    city: foundUser.city,
                    role: foundUser.role
                };
                result.token = jwt.sign(
                    result.user,
                    process.env.JWT_KEY, {
                        expiresIn: "1h"
                    }
                );
            }
        }
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(400).send('bad request');
    }
}
