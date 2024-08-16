const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const Buyurtma = sequelize.define(
		'buyurtma',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			fio: {
				type: DataTypes.STRING(300),
				allowNull: false,
			},
			region: {
				type: DataTypes.STRING(300),
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING(300),
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING(300),
				allowNull: false,
				defaultValue: 'Kutulmoqda',
			},
		},
		{ timestamps: true }
	)
	return Buyurtma
}
