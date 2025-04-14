const express = require('express');

const { addToCart, getCartItems, removeFromCart, updateCart } = require("../services/cart");
const { customerAuth } = require("../middlewares/auth");
const  validate = require("../middlewares/validate");
const { cartSchema } = require("../schema/schema");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

//get cart items
/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get all cart items for a customer
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *       404:
 *         description: Cart empty
 *       500:
 *         description: Internal server error
 */

router.get("/", customerAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const cartItems = await getCartItems(userId);
        if(cartItems.length === 0){
            return res.status(404).json({message: "Cart Empty"});
        }

        res.status(200).json({cartItems})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})


//add product to cart
/**
 * @swagger
 * /carts/{productId}:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to add
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *             required:
 *               - quantity
 *     responses:
 *       201:
 *         description: Product added to cart
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.post('/:productId', validate(cartSchema), customerAuth, async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user.id;
    const { quantity } = req.body;
    try {
        const addedToCart = await addToCart(productId, userId, quantity)
        if(addedToCart.error){
            return res.status(404).json({error: addedToCart.error});
        }

        res.status(201).json({
            message: "Product added to cart", 
            product: {
                productId: addedToCart.productId,
                quantity: addedToCart.quantity
            }});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


/**
 * @swagger
 * /carts/{cartId}:
 *   patch:
 *     summary: Update the quantity or remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               remove:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cart updated or product removed
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */

router.patch("/:cartId", customerAuth, validate(cartSchema), async (req, res) => {
    const userId = req.user.id;
    const cartId = req.params.cartId;
    const { quantity, remove } = req.body;
    try {
        const updatedCart = await updateCart(cartId, userId, quantity, remove);
        if(!updatedCart){
            return res.status(404).json({error: "Cart not found"});
        }
        if(updatedCart.deletedCount && updatedCart.deletedCount === 1){
            return res.status(200).json({message: "Product removed from cart"});
        }

        res.status(200).json({message: "Cart updated", cartItem: updatedCart});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})


//remove product from cart
/**
 * @swagger
 * /cart/{cartId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to remove
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

router.delete("/:cartId", customerAuth, async (req, res) => {
    const userId = req.user.id;
    const cartId = req.params.cartId;
    try {
        const removedCart = await removeFromCart(cartId, userId);
        if(removedCart.deletedCount === 0){
            return res.status(404).json({error: "Cart item not found"});
        }
        res.status(200).json({message: "Product removed from cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})



module.exports = router;