const Cart = require("../models/cart");
const mongoose = require("mongoose");
const { getProductById } = require("../services/product");

const addToCartRepo = async (cart) => {
    try {
        const newCart = Cart.create(cart);
        return newCart;
    } catch (error) {
        throw error;
    }
}

const getCartItemByIdRepo = async (cartItemId) => {
    try {
        const cartItem = await Cart.findById(cartItemId);
        return cartItem;
    } catch (error) {
        throw error;
    }
}


const getCartItemsRepo = async (userId) => {
    try {
        const cartItems = await Cart.find({userId});
        return cartItems;
    } catch (error) {
        throw error;
    }
}

const getCartItemByProductIdRepo = async (productId, userId) => {
    try {
        const cartItem = await Cart.findOne({ productId, userId});
        return cartItem;
    } catch (error) {
        throw error;
    }
}

const updateCartRepo = async (cartId, userId, quantity) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            {_id: cartId, userId}, 
            { $inc: { quantity: quantity } },
            { new: true } 
        );

        return updatedCart
    } catch (error) {
        throw error;
    }
}



const getDetailedCartItemsRepo = async (userId, session) => {
    try {
        const cartItems = await Cart.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                  from: "products", // collection name in MongoDB (usually plural, lowercase)
                  localField: "productId",
                  foreignField: "_id",
                  as: "productDetails"
                }
            },
        ],  { session });
        return cartItems;
    } catch (error) {
        throw error;
    }
}

const deleteCartByIdRepo = async (cartId, userId) => {
    try {
        const deletedCart = await Cart.deleteOne({_id: cartId, userId});
        return deletedCart;
    } catch (error) {
        throw error;
    }
}

const deleteCartItemsRepo = async (cartIds, session) => {
    try {
        const deletedCartItems = await Cart.deleteMany({
            _id: { $in: cartIds }
        }).session(session);
        return deletedCartItems;
    } catch (error) {
        throw error;
    }
}


module.exports = {
   addToCartRepo,
   getCartItemByIdRepo,
   getCartItemsRepo,
   getDetailedCartItemsRepo,
   deleteCartByIdRepo,
   deleteCartItemsRepo,
   getCartItemByProductIdRepo,
   updateCartRepo

}