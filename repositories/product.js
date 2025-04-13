const Product = require("../models/product");

const createProductRepo = async (product) => {
    try {
        const newProduct = Product.create(product);
        return newProduct;
    } catch (error) {
        throw error;
    }
}


const findProductByIdRepo = async (productId) => {
    try {
        const existingProduct = await Product.findById(productId);
        return existingProduct;
    } catch (error) {
        throw error;
    }
}

const findProductRepo = async () => {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw error;
    }
}

const updateProductRepo = async (productId, valueToUpdate) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            {_id: productId}, 
            valueToUpdate, 
            {new: true}
        );
        return updatedProduct;
    } catch (error) {
        throw error;
    }
}

const deleteProductRepo = async (productId) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        return deletedProduct;
    } catch (error) {
        throw error;
    }
}


const updateProductStockRepo = async (productId, amount, session) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            {
              _id: productId,
              ...(amount < 0 && { stock: { $gte: Math.abs(amount) } })
            },
            {
              $inc: { stock: amount }
            },
            {
              new: true 
            }
        ).session(session);
        return updatedProduct;
    } catch (error) {
        throw error;
    }
}

const findProductsByStockRepo = async (vendorId, maxStock) => {
    try {
        const products = await Product.find({
            vendorId: vendorId,
            stock: { $lte: maxStock } 
        });

        return products;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createProductRepo,
    findProductByIdRepo,
    findProductRepo,
    updateProductRepo,
    deleteProductRepo,
    updateProductStockRepo,
    findProductsByStockRepo
}