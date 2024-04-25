const app = require("./src/app");
const config = require("./config/local.json");

const PORT = config.PORT;
console.log(PORT);

// Listen to the express server
const server = app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});

module.exports = server;