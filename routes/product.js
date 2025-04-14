const express = require('express');

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../services/product");
const { vendorAuth } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { productSchema, updateProductSchema } = require("../schema/schema");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *  get:
 *    summary: Get all products
 *    tags: [Product]
 *    responses:
 *      200:
 *        description: A list of products
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *  
 *                  name:
 *                    type: string
 *                  price:
 *                    type: number
 *                  stock:
 *                    type: number
 *                  category:
 *                    type: string
 *                  vendorId:
 *                    type: string
 *      404:
 *        description: No products found
 *      500:
 *        description: Internal server error
 */

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


/**
 * @swagger
 * /products/{id}:
 *  get:
 *    summary: Get a product by ID
 *    tags: [Product]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The ID of the product to retrieve
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *       description: A product object
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             price:
 *               type: number
 *             stock:
 *               type: number
 *             category:
 *               type: string
 *             vendorId:
 *               type: string
 *    404:
 *      description: Product not found
 *    500:
 *      description: Internal server error
 */
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




/**
 * @swagger
 * /products:
 *  post:
 *    summary: Create a new product
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              price:
 *                type: number
 *              stock:
 *                type: number
 *              category:
 *                type: string
 *            required:
 *              - name
 *              - price
 *              - stock
 *              - category
 *
 *    responses:
 *      201:
 *        description: Product created successfully
 *      400:
 *        description: Bad request (validation error)
 *      500:
 *        description: Internal server error
 */
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


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - category
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request (validation error)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

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



/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
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
