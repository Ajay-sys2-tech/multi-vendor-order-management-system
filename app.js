const express = require("express");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/adminAnalytics");
const vendorRoutes = require("./routes/vendorAnalytics");
const app = express();

app.use(express.json());

app.get("/welcome", (req, res) => {
    res.send("Welcome to Multi-Vendor Order Management System!");
})

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);


module.exports = app;