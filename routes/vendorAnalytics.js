const express = require("express");
const { vendorAuth } = require("../middlewares/auth");
const { getProductWithLowStock, getDailySales } = require("../services/analytics")

const router = express.Router();

// daily sales of last days
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