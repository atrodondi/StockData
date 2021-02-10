const path = require("path");
const router = require("express").Router();
const brokersRoutes = require("./brokers");
const positionsRoutes = require("./positions");
const transactionRoutes = require("./transactions");

// brokers routes
router.use("/brokers", brokersRoutes);

// positions routes
router.use("/positions", positionsRoutes);

//transactions reoutes
router.use("/transactions", transactionRoutes);

// If no API routes are hit, send the React app
router.use(function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
