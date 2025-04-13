const User = require("../models/user");

const createUserRepo = async (user) => {
    try {
        const newUser = User.create(user);
        return newUser;
    } catch (error) {
        throw error;
    }
}


const findUserRepo = async (email) => {
    try {
        const existingUser = await User.findOne({email: email});
        return existingUser;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createUserRepo,
    findUserRepo,

}