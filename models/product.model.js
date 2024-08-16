const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const Product = sequelize.define(
		'product',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING(300),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(1000),
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ timestamps: true }
	)
	return Product
}
