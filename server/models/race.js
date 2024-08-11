'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Race extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Race.init({
    race_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    info_url: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.FLOAT, // Using FLOAT for latitude
      allowNull: true,       // Initially allowing null since existing records won't have these values
    },
    longitude: {
      type: DataTypes.FLOAT, // Using FLOAT for longitude
      allowNull: true,       // Initially allowing null
    }
  }, {
    sequelize,
    modelName: 'Race',
    tableName: 'races',
    timestamps: true
  });
  return Race;
};