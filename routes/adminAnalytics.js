const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const { getRevenuePerVendor, getTopProductsBySales, getAverageSales } = require("../services/analytics")

const router = express.Router();


//Revenue per vendor (past 30 days)
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