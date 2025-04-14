const express = require('express');
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../services/user");
const { findUserRepo } = require('../repositories/user');
const { createUserToken } = require("../utils/tokenUtils");
const  validate = require("../middlewares/validate");
const { userRegisterSchema, userLoginSchema } = require("../schema/schema");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - role
 *               - password
 *               - confirmPassword
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (user already exists)
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request (invalid credentials)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

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
