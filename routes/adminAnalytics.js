const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const { getRevenuePerVendor, getTopProductsBySales, getAverageSales } = require("../services/analytics")

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminAnalytics
 *   description: Admin-level insights on vendor performance and product sales
 */

//Revenue per vendor (past 30 days)
/**
 * @swagger
 * /admin-analytics/revenue:
 *   get:
 *     summary: Get revenue generated by each vendor over the past 30 days
 *     tags: [AdminAnalytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue per vendor retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get("/revenue", adminAuth, async (req, res) => {
    try {
        const revenue = await getRevenuePerVendor();
        res.status(200).json({revenue});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "internal Server Error"});
    }
});

// Top 5 products by sales
// Average order value
/**
 * @swagger
 * /admin-analytics/order-analysis:
 *   get:
 *     summary: Get top products by sales and average order value
 *     tags: [AdminAnalytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         required: false
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of past days to analyze
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top-selling products to return
 *     responses:
 *       200:
 *         description: Order analysis data retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get("/order-analysis", adminAuth, async (req, res) => {
    const {days=30, limit=5 } = req.query;
    try {
        const topProducts = await getTopProductsBySales(parseInt(days), parseInt(limit));
        const averageSales = await getAverageSales(parseInt(days));
        res.status(200).json({topProducts, metrics: averageSales});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "internal Server Error"});
    }
});


module.exports = router;