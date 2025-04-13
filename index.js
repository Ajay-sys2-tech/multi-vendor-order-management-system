const connectDB = require("./db/conn");
const app = require("./app");

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(4000, () => {
    console.log(`Server is running on port ${PORT}`);
})
