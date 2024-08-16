const Sequelize = require('sequelize')

const sequelize = new Sequelize('gulDokon', 'postgres', '1234567', {
	dialect: 'postgres',
	host: 'localhost',
})

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize
db.users = require('../models/users.model')(sequelize)
db.comment = require('../models/comment.model')(sequelize)
db.buyurtma = require('../models/buyurtma.model')(sequelize)
db.product = require('../models/product.model')(sequelize)

db.product.hasMany(db.comment, {
	as: 'comments',
	onDelete: 'CASCADE',
})

db.comment.belongsTo(db.product, {
	foreignKey: 'productId',
	as: 'product',
})

db.users.hasMany(db.product, {
	as: 'products',
	onDelete: 'CASCADE',
})

db.product.belongsTo(db.users, {
	foreignKey: 'userId',
	as: 'user',
})

db.product.hasMany(db.buyurtma, {
	as: 'buyurtma',
})

db.buyurtma.belongsTo(db.product, {
	as: 'product',
	foreignKey: 'productId',
})

module.exports = db
