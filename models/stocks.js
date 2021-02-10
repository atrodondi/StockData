module.exports = function (sequelize, DataTypes) {
  const Stocks = sequelize.define("Stocks", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    mark: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    open_price: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    volume: {
      type: DataTypes.INTEGER,
      require: true,
      allowNull: false
    },
    prev_close: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    premarket_change: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    }
  });

  return Stocks;
};
