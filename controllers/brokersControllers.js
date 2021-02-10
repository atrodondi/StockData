const db = require("../models");

module.exports = {
  // getting all brokers
  getAllBrokers: (req, res) => {
    console.log("getting brokers");
    db.Brokers.findAll()
      .then(result => {
        console.log(result);
        res.json(result);
      })
      .catch(err => res.status(422).json(err));
  },

  //   add a new broker to the DB
  addNewBroker: (req, res) => {
    let newBroker = req.body;
    let brokerName = req.body.name;
    console.log("#####Broker name of new broker adding", brokerName, newBroker);
    // first check to make sure that we havent already added that broker to the DB
    db.Brokers.findAll({
      where: {
        name: brokerName
      }
    })
      .then(result => {
        console.log("result of trying to add new broker", result);
        // if we find something, then that broker is already there and we dont need to add it again
        if (result.length > 0) {
          res.json({ message: "This Broker is Already in your Database!" });
        } else {
          // creating a new broker if it doesnt exist
          db.Brokers.create(newBroker).then(response => {
            console.log("New Broker*** " + response.name + "*** added");
            res.json(response);
          });
        }
      })
      .catch(err => res.status(422).json(err));

    //  else {
    //   db.Brokers.create(req.body)
    //     .then(result => {
    //       res.json(result.dataValues);
    //     })
    //     .catch(err => res.status(422).json(err));
    // }
  }
};
