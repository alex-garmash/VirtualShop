const jwt = require('jsonwebtoken');
const userModel = require('./users/users.model');

module.exports = async (req,res,next) => {
    
    try {        
        // expecting client to send the token via header authorization in this format:
        // Authorization: Bearer the token goes here
        let token = null;
        if(!req.headers.authorization) {
            throw "Missing Authorization header";
        }
        else {
            let broken = req.headers.authorization.split(" ");

            if (broken.length != 2 || broken[0] !== 'Bearer' || broken[1] === '') {
                throw "Invalid Authorization header";
            }
            else {
                token = req.headers.authorization.split(" ")[1];
                // jwt.verify will decode token first then check against the secret key}
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                let u = await userModel.getPromissionLevel(decoded.id);
                req.userData = {
                    id: decoded.id,
                    first_name: decoded.first_name,
                    last_name: decoded.last_name,
                    role: u.role
                };
                if(req.userData.role === 'Banned') {
                    throw "Banned user"
                }
                next();
            }
        }
    }
    catch(e) {
        console.log('Error:',e);
        return res.status(403).end();
    }        
};