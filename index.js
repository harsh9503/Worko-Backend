const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;
const database = require("./config/Database");
const Routes = require("./routes/Routes");

app.use(express.json());

database.connect();

app.use("/worko/user", Routes);


app.get("/", (req, res) => {
    const htmlContent = "<h1>Welcome to My Server</h1><p>Server is running</p>";
    return res.send(htmlContent);
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})