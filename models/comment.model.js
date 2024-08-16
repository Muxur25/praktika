const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const Comment = sequelize.define(
		'comment',

		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			text: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
		},
		{ timestamps: true }
	)
	return Comment
}
