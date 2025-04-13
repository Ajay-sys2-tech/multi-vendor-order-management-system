const { getRevenueRepo, getTopProductsBySalesRepo, getAverageSalesRepo, getDailySalesRepo } = require("../repositories/order");
const { findProductsByStockRepo } = require("../repositories/product")

const getRevenuePerVendor = async () => {
    try {
        const revenue = await getRevenueRepo();
        return revenue;
    } catch (error) {
        throw error;
    }
};


const getTopProductsBySales = async (days, limit) => {
    try {
        const topProducts = await getTopProductsBySalesRepo(days, limit);
        return topProducts;
    } catch (error) {
        throw error;
    }
};



const getAverageSales = async (days) => {
    try {
        const averageSales = await getAverageSalesRepo(days);
        return averageSales;
    } catch (error) {
        throw error;
    }
};


const getProductWithLowStock = async (vendorId, maxStock) => {
    try {
        const products = await findProductsByStockRepo(vendorId, maxStock);
        return products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                stock: product.stock,
                price: product.price,
                category: product.category
            };
        });
    } catch (error) {
        throw error;
    }
};

const getDailySales = async (vendorId, days) => {
    try {
        const dailySales = await getDailySalesRepo(vendorId, days);
       
       
        for(let i=1;i<=days;i++){
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
        
            if(!dailySales.find((sales) => sales.date === dateStr)){
                dailySales.push({
                    date: dateStr,
                    totalSales: 0,
                  })
            }
        }

        dailySales.sort((a, b) => b.date.localeCompare(a.date));
        return dailySales;
    } catch (error) {
        throw error;
    }
}





module.exports = {
    getRevenuePerVendor,
    getTopProductsBySales,
    getAverageSales,
    getProductWithLowStock,
    getDailySales
}