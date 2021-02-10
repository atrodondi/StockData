"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    var model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// models
db.Brokers = require("./brokers")(sequelize, Sequelize);
db.Positions = require("./positions")(sequelize, Sequelize);
db.Stocks = require("./stocks")(sequelize, Sequelize);
db.Transactions = require("./transactions")(sequelize, Sequelize);

//***************** */ ASSOCIATIONS

// //   associating brokers to the positions that may be held with that specific brokerage
db.Brokers.hasMany(db.Positions);
db.Positions.belongsTo(db.Brokers);

// associating positions to their tranasactions
db.Positions.hasMany(db.Transactions);
db.Transactions.belongsTo(db.Positions);

module.exports = db;
