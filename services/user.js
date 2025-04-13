const { createUserRepo, findUserRepo } = require("../repositories/user");

const createUser = async (user) => {
    try {
        const userExists = await findUserRepo(user.email);
        if(userExists){
            return {error: "User already exists."};
        }

        const newUser = await createUserRepo(user);
        return newUser;
    } catch (error) {
        throw error;
    }
};

const findUserByEmail = async (userEmail) => {
    try {
        const user = await findUserRepo(userEmail);
        return user;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createUser,
    findUserByEmail,

}