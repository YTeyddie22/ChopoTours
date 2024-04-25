const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const app = require("./app");

dotEnv.config({
    path: "./config.env",
});

const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(`Error: ${err}`));

const port = 3000 || process.env.PORT;

console.log(process.env.NODE_ENV);

app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});
