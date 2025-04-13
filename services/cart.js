const { addToCartRepo, getCartItemByProductIdRepo, getCartItemsRepo, deleteCartByIdRepo, updateCartRepo} = require("../repositories/cart");
const { findProductByIdRepo } = require("../repositories/product");


const getCartItems = async (userId) => {
    try {
        const cartItems = await getCartItemsRepo(userId);
        return cartItems.map((item) => {
            return {
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const addToCart = async ( productId, userId, quantity ) => {
    try {
        const productExist = await findProductByIdRepo(productId);
        if(!productExist || productExist.stock < quantity){
            return ({error: "Product not found or selected quantity is more than existing stock"});
        }

        // if product is already in the cart just add the quantity
        const itemExistInCart = await getCartItemByProductIdRepo(productId, userId);
        if(itemExistInCart){
            const updatedCart = await updateCartRepo(itemExistInCart._id, quantity);
            return updatedCart;
        }

        // if not create a cart entry
        const addedToCart = await addToCartRepo({userId, productId, quantity});
        return addedToCart;
    } catch (error) {
        console.log(error);
    }
}
//to implement in add to cart, update cart if the product already exists in the cart

const updateCart = async (cartId, userId, quantity, remove=false) => {
    try {
        const updatedCart = await updateCartRepo(cartId, userId, remove ? -quantity : quantity);

        if(updatedCart && updatedCart.quantity <= 0){
            const removedCart = await removeFromCart(cartId, userId);
            return removedCart;
        }

        return updatedCart;
     } catch (error) {
        throw error;
    }
}

const removeFromCart = async ( cartId, userId) => {
    try {
        const removedItemFromCart = await deleteCartByIdRepo(cartId, userId);
        return removedItemFromCart; 
    } catch (error) {
        console.log(error);
    }
 }


module.exports = {
    getCartItems,
    addToCart,
    removeFromCart,
    updateCart
}