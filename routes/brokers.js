const router = require("express").Router();
const brokersControllers = require("../controllers/brokersControllers");

// add new broker to your db
//  post @@ /brokers/addNew
router.route("/addNew").post(brokersControllers.addNewBroker);

// getting all brokers
// get @@  //brokers/getAll
router.route("/getAll").get(brokersControllers.getAllBrokers);

module.exports = router;
