    const { 
        createProductRepo, 
        findProductRepo, 
        findProductByIdRepo,
        updateProductRepo,
        deleteProductRepo,
    } = require("../repositories/product");


const createProduct = async (product) => {
    try {
        const newProduct = await createProductRepo(product);
        return newProduct;
    } catch (error) {
        throw error;
    }
};

const getProducts = async () => {
    try {
        const products = await findProductRepo();
        return products;
    } catch (error) {
        throw error;
    }
}

const getProductById = async(productId) => {
    try {
       const product = await findProductByIdRepo(productId);
       return product;
    } catch (error) {
        throw error;
    }
}

const updateProduct = async (productId, valueToUpdate) => {
    try {
        const updatedProduct = await updateProductRepo(productId, valueToUpdate);
        return updatedProduct;
    } catch (error) {
        throw error;
    }
}

const deleteProduct = async (productId) => {
    try {
        const deletedProduct = await deleteProductRepo(productId);
        return deletedProduct;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}