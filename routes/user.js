const express = require('express');
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../services/user");
const { findUserRepo } = require('../repositories/user');
const { createUserToken } = require("../utils/tokenUtils");
const  validate = require("../middlewares/validate");
const { userRegisterSchema, userLoginSchema } = require("../schema/schema");

const router = express.Router();

router.post("/register", validate(userRegisterSchema), async (req, res) => {
    try {
        const { name, email, role, password, confirmPassword } = req.body;
        if(password !== confirmPassword) {
            res.status(400).json({ error: 'Password and Confirm password should match!' });
            return;
        }

        let hashedPassword = await bcrypt.hash(password, 5);
        const user = await createUser({name, email, role, password: hashedPassword,});
    
        if(user.error) {
            res.status(400).json(user);
        }

        else{
            res.status(201).json({
                message: "User added succesfully!", 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error.'});
    }
});



router.post("/login", validate(userLoginSchema), async (req, res) => {
    
    try {
        const { email, password, role } = req.body;
        const userExists = await findUserByEmail(email);
        if(!userExists || userExists.role !== role){
            return res.status(404).json({error: "User not found"});
        }
        
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        
        if(!isPasswordValid) {
            return res.status(400).json({error: "Incorrect email or password"});
        }

        const token = await createUserToken(userExists);

        res.status(200).json({
            message: `Welcome ${userExists.name}`,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Unexpected error'});
    }
});



module.exports = router;
