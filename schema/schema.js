// schemas/userSchema.js
const { z } = require('zod');

const userRegisterSchema = z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().email('Invalid email'),
    role: z.enum(["customer", "vendor", "admin"], "Role is required"),
    password: z.string().trim().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().trim().min(4, 'Password must be at least 4 characters'),
});


const userLoginSchema = z.object({
    email: z.string().trim().email('Invalid email'),
    role: z.enum(["customer", "vendor", "admin"], "Role is required"),
    password: z.string().trim().min(4, 'Password must be at least 4 characters'),
});


const productSchema = z.object({
    name: z.string().trim().min(3, 'Name is required'),
    price: z.number('Price is required').positive('Price is required and should be a positive number'),
    category: z.string().trim().min(3, 'Category is required'),
    stock: z.number().int().positive('Stock is required and should be a positive number'),
});


const updateProductSchema = z
  .object({
    name: z.string().trim().min(3, 'Name cannot be empty').optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().positive().optional(),
    category: z.string().trim().min(3, 'Category cannot be empty').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

const cartSchema = z.object({
    quantity: z.number().int().positive("Quantity is required and should be positive"),
    remove: z.boolean().default(false).optional()
})


module.exports = {
    userRegisterSchema,
    userLoginSchema,
    productSchema,
    updateProductSchema,
    cartSchema
};
