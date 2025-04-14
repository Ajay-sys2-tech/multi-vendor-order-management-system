const connectDB = require("./db/conn");
const app = require("./app");

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
})
