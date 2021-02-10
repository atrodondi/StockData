const router = require("express").Router();
const transactionsControllers = require("../controllers/transactionsControllers");

// add new transaction route
router.route("/addNew").post(transactionsControllers.addNewTransaction);

// get all transactions
router.route("/getAll").get(transactionsControllers.getAll);

// deposit money into broker account
// @@ transactions/deposit
router.route("/deposit").post(transactionsControllers.deposit);

//withddrawl money from broker account
// @@ transactions/withdraw
router.route("/withdraw").post(transactionsControllers.withdraw);

module.exports = router;
