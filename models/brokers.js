module.exports = function (sequelize, DataTypes) {
  const Brokers = sequelize.define("Brokers", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: DataTypes.STRING,
    capital: DataTypes.FLOAT,
    initial_stake: DataTypes.FLOAT
  });

  return Brokers;
};
