module.exports = function (sequelize, DataTypes) {
  var Transactions = sequelize.define("Transactions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    qty: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    share_price: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    total_trade_cost: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    broker: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false
    },
    trade_time: {
      type: DataTypes.DATE,
      require: true,
      allowNull: false
    }
  });

  return Transactions;
};
