const express = require('express');

const { addToCart, getCartItems, removeFromCart, updateCart } = require("../services/cart");
const { customerAuth } = require("../middlewares/auth");
const  validate = require("../middlewares/validate");
const { cartSchema } = require("../schema/schema");

const router = express.Router();

//get cart items
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