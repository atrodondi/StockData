const db = require("../models");

module.exports = {
  // getting all Positions
  getAllPositions: (req, res) => {
    console.log("getting Positions");
    console.log(req.body);
    db.Positions.findAll()
      .then(result => {
        console.log(result);
        res.json(result);
      })
      .catch(err => res.status(422).json(err));
  }
};
