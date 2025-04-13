const express = require('express');

const { createOrder, getOrders, getOrderById, changeOrderStatus, getOrdersByVendorId } = require("../services/order");
const { customerAuth, vendorAuth } = require("../middlewares/auth");

const router = express.Router();




//get orders by vendors
router.get("/recieved", vendorAuth, async (req, res) => {
    const vendorId = req.user.id;
    const orderStatus = req.query.status ?? 'created';
    try {
        const orders = await getOrdersByVendorId(vendorId, orderStatus);
        if(orders.length === 0){
            return res.status(404).json({error: "No orders found"});
        }

        res.status(200).json({orders: orders});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
} )



//get orders 

router.get("/", customerAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await getOrders(userId);
        if(orders.length === 0){
            return res.status(404).json({message: "No orders found"});
        }

        res.status(200).json({orders}) 
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

//get order by id
router.get("/:orderId", customerAuth, async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await getOrderById(orderId);
        if(!order){
            return res.status(404).json({message: "Order not found"});
        }

        res.status(200).json({order}) 
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})


//create an order from the cart
router.post('/', customerAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const createdOrder = await createOrder(userId);
        if(createdOrder.totalOrderValue === 0){
            return res.status(404).json({error: "No items in the cart to create a order"});
        }

        res.status(201).json({message: "Order created successfully", orders: createdOrder});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//update order status, only the product owner should be able to do this
router.put("/:orderId", vendorAuth, async (req, res) => {
    const orderId = req.params.orderId;
    const status = req.body.status;
    const vendorId = req.user.id;
    try {
        const updatedOrder = await changeOrderStatus(orderId, vendorId, status);
        if(!updatedOrder){
            return res.status(404).json({message: "Order not found "});
        }
        res.status(200).json({message: "Order status updated successfully", order: updatedOrder});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


module.exports = router;