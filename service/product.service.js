const db = require('../db/index')
const Product = db.product
const Comment = db.comment
const Buyurtma = db.buyurtma
const User = db.users

class ProductService {
	async add(title, image, description, amount, userId) {
		if (!(title || image || description || amount)) {
			throw new Error('Qaysidur malumotni qoldirib ketdingiz')
		}
		await Product.create({ title, image, description, amount: +amount, userId })
		return 'Yaratildi tovar'
	}

	async delete(id) {
		if (!id) {
			throw new Error('Bunday tovar mavjud emas')
		}
		try {
			await Product.destroy({ where: { id } })
		} catch (error) {
			throw new Error('Nimadur xato ketdi')
		}
	}

	async update(title, image, description, amount, id) {
		try {
			await Product.update(
				{ title, image, description, amount },
				{ where: { id } }
			)
			return { massage: 'sucess' }
		} catch (error) {
			throw new Error('Nimadur xato ketdi')
		}
	}

	async myProduct(id) {
		try {
			const data = await Product.findAll({
				where: { userId: id },
				raw: true,
				plain: false,
				nest: true,
				include: ['user'],
			})
			return data
		} catch (error) {
			throw new Error(error)
		}
	}

	async updatePage(id) {
		const data = await Product.findByPk(id, { raw: true })
		return data
	}

	async oneProduct(id) {
		const data = await Product.findByPk(id, {
			raw: false,
			include: ['user', 'comments'],
			nest: true,
			plain: true,
		})
		return data.toJSON()
	}

	async addComment(id, email, text) {
		await Comment.create({ email, text, productId: id })
	}

	async getAllProduct(paganetion, limits) {
		try {
			const data = await Product.findAll({
				raw: true,
				plain: false,
				nest: true,
				include: [{ model: User, as: 'user' }],
				limit: limits,
				offset: (paganetion - 1) * limits,
			})
			const totalData = await Product.count()
			return { data, totalData }
		} catch (error) {
			throw new Error(error)
		}
	}

	async buyurtma(fio, phone, region, productId) {
		try {
			if (!productId) {
				return { error: 'Kamida bitta tovarni tanlashingiz kerak' }
			}
			if (!(fio || phone || region)) {
				return { error: 'Qaysidur malumotni kiritmadingiz' }
			}
			await Buyurtma.create({ fio, phone, region, productId })
			return { zor: 'Qabul qilindi' }
		} catch (error) {
			console.log(error)
		}
	}

	async buyurtmalar(id) {
		const data = await Product.findAll({
			include: [
				{
					model: Buyurtma,
					as: 'buyurtma',
					required: true,
				},
				{
					model: User,
					as: 'user',
					where: { id },
					required: true,
				},
			],
			raw: true,
			plain: false,
			nest: true,
		})
		return data
	}

	async bekor(id) {
		await Buyurtma.update({ status: 'bekor qilindi' }, { where: { id } })
	}

	async sotildi(id) {
		await Buyurtma.update({ status: 'sotildi' }, { where: { id } })
	}

	async deleteComment(id) {
		await Comment.destroy({ where: { id } })
	}
}

module.exports = new ProductService()
