const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: true }));

// Define Routes
app.use("/api/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
