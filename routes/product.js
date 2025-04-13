const express = require('express');

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../services/product");
const { vendorAuth } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { productSchema, updateProductSchema } = require("../schema/schema");

const router = express.Router();

//get all products
router.get("/", async (req, res) => {
    try {
        const products = await getProducts();
        if(products.length === 0){
            return res.status(404).json({error: "No products found."});
        }
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({errror: "Internal Server Error."})
    }
});


//get a product by id
router.get("/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await getProductById(productId);
        if(!product){
            return res.status(404).json({error: "Product not found."});
        }
        res.status(200).json({product});
       
    } catch (error) {
        console.log(error);
        res.status(500).json({errror: "Internal Server Error."})
    }
});




//add a product
router.post("/", vendorAuth, validate(productSchema), async (req, res) => {
    try {
        const { name, price, stock, category, } = req.body;
        const vendorId = req.user.id;
        const newProduct = await createProduct({name, price, stock, category, vendorId});
        res.status(201).json({
            message: "Product created", 
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({errror: "Internal Server Error."})
    }
});



//update a product
router.put("/:id",vendorAuth, validate(updateProductSchema), async (req, res) => {
    const productId = req.params.id;
    try {
        const { name, price, stock, category, } = req.body;
        let valueToUpdate = Object.fromEntries(
            Object.entries({ name, price, stock, category })
                .filter(([key, value]) => value && value !== '')
        );

        const updatedProduct = await updateProduct(productId, valueToUpdate);
        res.status(200).json({
            message: "Product updated", 
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({errror: "Internal Server Error."})
    }
});



//delete a product
router.delete("/:id", vendorAuth, async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await deleteProduct(productId);
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found."})
        }
        res.status(200 ).json({message: "Product deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({errror: "Internal Server Error."})
    }
})






module.exports = router;
