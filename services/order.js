const { getCartItemsRepo, getDetailedCartItemsRepo, deleteCartItemsRepo } = require("../repositories/cart");
const { updateProductStockRepo } = require("../repositories/product");
const { addToOrderRepo, getOrderItemsRepo, getOrderItemByIdRepo, changeOrderStatusRepo, getOrdersByVendorIdRepo } = require("../repositories/order");
const mongoose = require('mongoose');



//without tranasction
const createOrder2 = async (userId) => {
    try {
        const cartItems = await getDetailedCartItemsRepo(userId);
        const filteredItems = cartItems.filter(
            (item) => item.quantity <= item.productDetails[0].stock
        );

        const subOrders = {};

        //create suborders based on vendors
        filteredItems.forEach((item) => {
            if(item.productDetails[0].vendorId in subOrders){
               subOrders[item.productDetails[0].vendorId].items.push({
                productId: item.productId,
                quantity: item.quantity
            });
               subOrders[item.productDetails[0].vendorId].subtotal += item.price * item.quantity;
            }

            else{
                subOrders[item.productDetails[0].vendorId] = {
                    items: [{
                        productId: item.productId,
                        quantity: item.quantity
                    }],
                    subtotal: item.quantity * item.productDetails[0].price
                }
            }
        });

        const orderSummary = {
            totalOrderValue: Object.values(subOrders).reduce((total, order) => {
                return total + order.subtotal;
            }, 0),
            subOrders,
        };


        const cartIds = filteredItems.map((item) => item._id);

        const orderItems = filteredItems.map((item) => {
            return{
                userId,
                productId: item.productId,
                quantity: item.quantity,
                vendorId: item.productDetails[0].vendorId,
                status: "created"
            };
        });

        //deduct stock of each product
        orderItems.forEach(async (item) => {
            await updateProductStockRepo(item.productId, item.quantity);
        })

        //add to orders 
        const savedOrders = await addToOrderRepo(orderItems);

        //remove items from cart
        await deleteCartItemsRepo(cartIds);
        return orderSummary;
    } catch (error) {
        throw error;
    }
};

// using transaction
const createOrder3 = async (userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cartItems = await getDetailedCartItemsRepo(userId, session);

        const filteredItems = cartItems.filter(
            (item) => item.quantity <= item.productDetails[0].stock
        );

        const subOrders = {};

        // Create suborders based on vendors
        filteredItems.forEach((item) => {
            const vendorId = item.productDetails[0].vendorId;
            if (vendorId in subOrders) {
                subOrders[vendorId].items.push({
                    productId: item.productId,
                    quantity: item.quantity
                });
                subOrders[vendorId].subtotal += item.price * item.quantity;
            } else {
                subOrders[vendorId] = {
                    items: [{
                        productId: item.productId,
                        quantity: item.quantity
                    }],
                    subtotal: item.quantity * item.productDetails[0].price
                };
            }
        });

        const orderSummary = {
            totalOrderValue: Object.values(subOrders).reduce((total, order) => {
                return total + order.subtotal;
            }, 0),
            subOrders,
        };

        const cartIds = filteredItems.map((item) => item._id);

        const orderItems = filteredItems.map((item) => ({
            userId,
            productId: item.productId,
            quantity: item.quantity,
            vendorId: item.productDetails[0].vendorId,
            status: "created"
        }));

        // Deduct stock of each product
        for (const item of orderItems) {
            await updateProductStockRepo(item.productId, item.quantity, session);
        }

        // Add to orders
        await addToOrderRepo(orderItems, session);

        // Remove items from cart
        await deleteCartItemsRepo(cartIds, session);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return orderSummary;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//using transaction with interactive logs
const createOrder = async (userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("🔄 Starting transaction...");

        const cartItems = await getDetailedCartItemsRepo(userId, session);
        console.log("🛒 Cart items fetched:", cartItems.length);

        const filteredItems = cartItems.filter(
            (item) => item.quantity <= item.productDetails[0].stock
        );

        const subOrders = {};

        filteredItems.forEach((item) => {
            const vendorId = item.productDetails[0].vendorId;

            if (subOrders[vendorId]) {
                subOrders[vendorId].items.push({
                    productId: item.productId,
                    quantity: item.quantity
                });
                subOrders[vendorId].subtotal += item.price * item.quantity;
            } else {
                subOrders[vendorId] = {
                    items: [{
                        productId: item.productId,
                        quantity: item.quantity
                    }],
                    subtotal: item.quantity * item.productDetails[0].price
                };
            }
        });

        const orderSummary = {
            totalOrderValue: Object.values(subOrders).reduce((total, order) => total + order.subtotal, 0),
            subOrders,
        };

        const cartIds = filteredItems.map((item) => item._id);

        const orderItems = filteredItems.map((item) => ({
            userId,
            productId: item.productId,
            quantity: item.quantity,
            vendorId: item.productDetails[0].vendorId,
            status: "created"
        }));

        // 1. Deduct stock
        for (const item of orderItems) {
            console.log(`📉 Deducting stock for product ${item.productId} by ${item.quantity}`);
            await updateProductStockRepo(item.productId, item.quantity, session);
        }

        // Uncomment below to simulate failure
        // throw new Error("💥 Simulated failure after stock deduction");

        // 2. Add orders
        console.log("📦 Saving orders...");
        await addToOrderRepo(orderItems, session);
        console.log("✅ Orders saved");

        // 3. Delete cart items
        console.log("🗑 Removing cart items...");
        await deleteCartItemsRepo(cartIds, session);
        console.log("✅ Cart items removed");

        // Commit
        await session.commitTransaction();
        session.endSession();
        console.log("🎉 Transaction committed successfully!");

        return orderSummary;

    } catch (error) {
        console.error("❌ Transaction failed, rolling back:", error.message);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getOrders = async (userId) => {
    try {
        const orderItems = await getOrderItemsRepo(userId);
        const orderSummary = orderItems.reduce((obj, item) => {
            obj.totalPrice += item.subTotal; 
            obj.totalQuantity += item.subQuantity;
            return obj; 
        }, {totalPrice: 0, totalQuantity: 0});
        return {orderSummary, orderItems};
    } catch (error) {
        throw error;
    }
}

const getOrderById = async (orderId) => {
    try {
        const order = await getOrderItemByIdRepo(orderId);
        return {
            id: order._id,
            productId: order.productId,
            vendorId: order.vendorId,
            quantity: order.quantity,
            status: order.status,
            orderDate: order.createdAt,
            productInfo: {
                name: order.productInfo[0].name,
                price: order.productInfo[0].price,
            }

        };
    } catch (error) {
        throw error;
    }
}


const changeOrderStatus = async (orderId, vendorId, status) => {
    try {
        const updatedOrder = await changeOrderStatusRepo(orderId, vendorId, status);
        return updatedOrder;
    } catch (error) {
        throw error;
    }
}

const getOrdersByVendorId = async (vendorId, status) => {
    try {
        const orders = await getOrdersByVendorIdRepo(vendorId, status);
        return orders.map((order) => {
            return {
                id: order._id,
                productId: order.productId,
                userId: order.userId,
                quantity: order.quantity,
                orderDate: order.createdAt,
            };
        })
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    changeOrderStatus,
    getOrdersByVendorId
}