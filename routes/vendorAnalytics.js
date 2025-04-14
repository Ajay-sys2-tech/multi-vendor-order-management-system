const express = require("express");
const { vendorAuth } = require("../middlewares/auth");
const { getProductWithLowStock, getDailySales } = require("../services/analytics")

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Vendor analytics and reporting
 */


// daily sales of last days
/**
 * @swagger
 * /vendor/sales:
 *   get:
 *     summary: Get daily sales for the past number of days (Vendor only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         required: false
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to retrieve sales for
 *     responses:
 *       200:
 *         description: Daily sales data retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get("/sales", vendorAuth, async (req, res) => {
    const vendorId = req.user.id;
    const {days=7} = req.query;
    try {
        const dailySales = await getDailySales(vendorId, days);
        res.status(200).json({dailySales});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})



// get low stock items
/**
 * @swagger
 * /vendor/low-stock:
 *   get:
 *     summary: Get products with low stock (Vendor only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: maxStock
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum stock level to consider a product low in stock
 *     responses:
 *       200:
 *         description: Products with low stock retrieved successfully
 *       404:
 *         description: No products with low stock found
 *       500:
 *         description: Internal server error
 */

router.get("/low-stock", vendorAuth, async (req, res) => {
    const vendorId = req.user.id;
    const {maxStock=10} = req.query;
    try {
        const products = await getProductWithLowStock(vendorId, maxStock);
        if(products.length === 0){
            return res.status(404).json({error: "No products with low stock found"});
        }
        res.json({products});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


module.exports = router;