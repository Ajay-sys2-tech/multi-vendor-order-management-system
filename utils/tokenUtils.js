const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken');

const createUserToken = async (user) => {
    let secret;
    if(user.role === "customer") secret = process.env.JWT_CUSTOMER_SECRET;
    else if(user.role === "vendor")secret = process.env.JWT_VENDOR_SECRET;
    else if(user.role === "admin")secret = process.env.JWT_ADMIN_SECRET;
    try{
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, secret);
    
        return token;
    }catch(error){
        throw error;
    }
};

module.exports = {
    createUserToken,

}
