const Order = require("../models/order");
const mongoose = require("mongoose");

const addToOrderRepo = async (items, session) => {
    try {
        const newOrder = Order.create(items, { session });
        return newOrder;
    } catch (error) {
        throw error;
    }
}

const getOrderItemByIdRepo = async (orderId) => {
    try {
        // const orderItem = await Order.findById(orderId);
        const orderItem = await Order.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(orderId)}},
            {$lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productInfo"
            }}
        ])
        return orderItem[0];
    } catch (error) {
        throw error;
    }
}


const getOrderItemsRepo = async (userId, orderStatus) => {
    try {
        
        const orderItems = await Order.aggregate([
            // 1. Match by userId
            {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: orderStatus
            }
            },
        
            // 2. Lookup product details
            {
            $lookup: {
                from: 'products', 
                localField: 'productId',
                foreignField: '_id',
                as: 'productInfo'
            }
            },
        
            // 3. Unwind the joined productInfo array
            {
            $unwind: '$productInfo'
            },
        
            // 4. Add a calculated field: price * quantity
            {
            $addFields: {
                lineTotal: { $multiply: ['$quantity', '$productInfo.price'] }
            }
            },
        
            // 5. Group by vendorId and sum the line totals
            {
            $group: {
                _id: '$vendorId',
                subTotal: { $sum: '$lineTotal' },
                subQuantity: { $sum: "$quantity" },
                products: { 
                    $push: {
                        orderId: '$_id',
                        productId: '$productId',
                        name: '$productInfo.name',
                        quantity: '$quantity',
                        price: '$productInfo.price'
                    }
                 } 
            }
            }
        ]);
        
        return orderItems;
    } catch (error) {
        throw error;
    }
}

const changeOrderStatusRepo = async (orderId, vendorId, status) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(orderId), vendorId}, {status}, {new: true});
        return updatedOrder;
    } catch (error) {
        throw error;
    }
};

const getOrdersByVendorIdRepo = async (vendorId, status) => {
    try {
        const orders = await Order.find({vendorId, status});
        return orders;
    } catch (error) {
        throw error;
    }
}


const getRevenueRepo = async () => {
    try {
        const revenue = await Order.aggregate([
            {
                $match: {
                  createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // last 30 days
                  }
                }
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $lookup: {
                  from: 'users',
                  localField: 'vendorId',
                  foreignField: '_id',
                  as: 'vendorInfo'
                }
              },
              { $unwind: '$vendorInfo' },
            {
                $group : {
                    _id : '$vendorId',
                    vendorName: { $first: '$vendorInfo.name' },
                    totalRevenue : { $sum : { $multiply : [ "$quantity", "$productInfo.price" ] } }
                } 
            },
            {
                $project: {
                  _id: 0,
                  vendorId: '$_id',
                  vendorName: 1,
                  totalRevenue: 1
                }
            }
        ]);

        return revenue;
    } catch (error) {
        throw error;
    }
}

const getTopProductsBySalesRepo = async (days=30, limit=5) => {
    try {
        const topProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
                    }
                }
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $addFields: {
                    lineTotal: {
                    $multiply: ['$quantity', '$productInfo.price']
                    }
                }
              },
            {
                $group: {
                    _id: '$productInfo._id',
                    name: { $first: '$productInfo.name' },
                    totalSales: { $sum: '$lineTotal' }
                }
            },
            { $sort: { totalSales: -1 } },

            { $limit: limit },
            {
                $project: {
                  _id: 0,
                  productId: '$_id',
                  name: 1,
                  price: 1,
                  totalSales: 1
                }
            }
        ]);

        return topProducts;
    } catch (error) {
        throw error;
    }
}


const getAverageSalesRepo = async (days=30) => {
    try {
        const averageSales = 
        await Order.aggregate([
            {
                $match: {
                    createdAt: {
                      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
                    }
                }
            },
            {
              $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productInfo'
              }
            },
            { $unwind: '$productInfo' },
            {
              $addFields: {
                lineTotal: {
                  $multiply: ['$quantity', '$productInfo.price']
                }
              }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$lineTotal' },
                totalOrders: { $sum: 1 }
              }
            },
          
            // Calculate average
            {
              $project: {
                _id: 0,
                averageSales: {
                  $divide: ['$totalRevenue', '$totalOrders']
                },
                totalRevenue: 1,
                totalOrders: 1
              }
            }
          ]);
          return averageSales;
    } catch (error) {
        throw error;
    }
} 


const getDailySalesRepo = async (vendorId, days) => {
    try {

        const dailySales = await Order.aggregate([
        // Filter orders in the last x days for a specific vendor
        {
            $match: {
                vendorId: new mongoose.Types.ObjectId(vendorId),
                createdAt: {
                    $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
                }
            }
        },

        // Lookup product to get price
        {
            $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'productInfo'
            }
        },
        { $unwind: '$productInfo' },
        {
            $addFields: {
            lineTotal: {
                $multiply: ['$quantity', '$productInfo.price']
            }
            }
        },

        // Group by day
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                totalSales: { $sum: '$lineTotal' },
                totalOrders: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' }
            }
        },
        { $sort: { _id: -1 } },
        {
            $project: {
                _id: 0,
                date: '$_id',
                totalSales: 1,
                totalOrders: 1,
                totalQuantity: 1
            }
        }
        ]);

        return dailySales;
    } catch (error) {
        throw error;
    }
}

  

module.exports = {
  addToOrderRepo,
  getOrderItemByIdRepo,
  getOrderItemsRepo,
  changeOrderStatusRepo,
  getOrdersByVendorIdRepo,
  getRevenueRepo,
  getTopProductsBySalesRepo,
  getAverageSalesRepo,
  getDailySalesRepo
}