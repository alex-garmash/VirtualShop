const bcrypt = require("bcrypt");

const saltRound = 10;

module.exports = {
    /** function return hash **/
    hash: (plainTextPwd) => {
        return bcrypt.hash(plainTextPwd,saltRound);
    },
    /** function validate value and hash **/
    verify: (plainTextPwd,hash) => {
        return bcrypt.compare(plainTextPwd,hash);
    }
};



 