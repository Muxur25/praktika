const { DataTypes } = require('sequelize')
const { sequelize } = require('../db')

module.exports = sequelize => {
	const Users = sequelize.define(
		'users',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING(150),
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING(550),
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING(150),
				allowNull: true,
			},
		},
		{ timestamps: true }
	)

	return Users
}
