const router = require("express").Router();
const positionsControllers = require("../controllers/positionsControllers");

// getting all positions
// @@  //positions/getAll
router.use("/getAll", positionsControllers.getAllPositions);

module.exports = router;
