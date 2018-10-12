const Category = require('./categories.schema');

module.exports = {
    getAll: () => {
        return Category.find({});
    },
    create: (Obj) => {
        let newCategory = new Category(Obj);
        return newCategory.save();
    },
    getOneByID: (id) => {
        return Category.findById({_id: id});
    },
    update: (Obj) => {
        return Category.findOneAndUpdate({_id: Obj._id}, Obj,{upsert: true});
    },
    getOrCreateCategory: (getQuery) => {
        return new Promise(async (resolve, reject) => {
            try {
                let requestedCategory = await Category.findOne(getQuery);
                if (!requestedCategory) {
                    requestedCategory = new Category(getQuery);
                    await requestedCategory.save();
                }
                resolve(requestedCategory);
            } catch (error) {
                reject(error)
            }
        })
    }
};