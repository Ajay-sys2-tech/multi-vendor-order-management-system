const express = require('express');

const { createOrder, getOrders, getOrderById, changeOrderStatus, getOrdersByVendorId } = require("../services/order");
const { customerAuth, vendorAuth } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Order
 * description: Order management
 */
/**
 * @swagger
 * /orders/recieved:
 *   get:
 *     summary: Get all orders for a vendor
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: The status of the order (created, shipped, delivered, etc.)
 *     responses:
 *       200:
 *         description: A list of orders for the vendor
 *       404:
 *         description: No orders found for the vendor
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for a customer
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *         required: false
 *         description: The status of the order (created, shipped, delivered, etc.)
 *     responses:
 *       200:
 *         description: A list of orders for the customer
 *       404:
 *         description: No orders found for the customer
 *       500:
 *         description: Internal server error
 */

router.get("/", customerAuth, async (req, res) => {
    const userId = req.user.id;
    const { orderStatus="created" } = req.query;
    try {
        const orders = await getOrders(userId, orderStatus );
        if(orders.orderItems.length === 0){
            return res.status(404).json({message: "No orders found"});
        }

        res.status(200).json({orders}) 
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get an order by ID (Customer only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (Customer only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       404:
 *         description: No items in the cart to create an order
 *       500:
 *         description: Internal server error
 */

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
/**
 * @swagger
 * /orders/{orderId}:
 *   put:
 *     summary: Update order status (Vendor only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

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