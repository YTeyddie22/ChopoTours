const dotEnv = require("dotenv");

dotEnv.config({
  path: "./config.env",
});

const app = require("./app");

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
