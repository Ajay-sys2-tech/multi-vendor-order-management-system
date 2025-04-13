const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const customerAuth = (req, res, next) => {
    const {authorization} = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({error: 'Access denied. No token provided.'});
    }

    jwt.verify(token, process.env.JWT_CUSTOMER_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Invalid or expired token.'});
        }
        req.user = decoded; 
        next();
    });
}


const vendorAuth = (req, res, next) => {
    const {authorization} = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({error: 'Access denied. No token provided.'});
    }

    jwt.verify(token, process.env.JWT_VENDOR_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Invalid or expired token.'});
        }
        req.user = decoded; 
        next();
    });
}


const adminAuth = (req, res, next) => {
   const {authorization} = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({error: 'Access denied. No token provided.'});
    }

    jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Invalid or expired token.'});
        }
        req.user = decoded; 
        next();
    });
}

module.exports = {
    customerAuth,
    vendorAuth,
    adminAuth
}