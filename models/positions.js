module.exports = function (sequelize, DataTypes) {
  const Positions = sequelize.define("Positions", {
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

    qty: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    cost_basis: {
      type: DataTypes.FLOAT,
      require: true,
      allowNull: false
    },
    total_cost: {
      type: DataTypes.STRING,
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
    },
    status: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false,
      defaultValue: "OPEN"
    }
  });

  return Positions;
};
