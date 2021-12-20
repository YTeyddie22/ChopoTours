const mongoose = require("mongoose");
const dotEnv = require("dotenv");

dotEnv.config({
  path: "./config.env",
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(`Error: ${err}`));

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
