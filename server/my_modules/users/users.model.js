const Users = require('./users.schema');

module.exports = {
    getAll: () => {
        return Users.find();
    },
    create: (userObj) => {
        let user = new Users(userObj);
        return user.save();
    },
    getOneByID: (id) => {
        return Users.findById({_id: id});
    },
    update: (userObj) => {
        return Users.findOneAndUpdate({_id: userObj._id}, userObj,{upsert: true});
    },
    delete: (id) => {
        return Users.remove({_id:id});
    },
    checkIfEmailAndIDExist(){
        return Users.find({},{'email':'email', 'ID' : 'ID'});
    },
    login(){
        return Users.find({}).select({email: 'email', hash: 'hash', role: 'role'});
    },
    byEmail: (email) => {
        return Users.findOne({email:email});
    },
    getPromissionLevel: (id) => {
        return Users.findOne({_id:id},'role');
    }
};