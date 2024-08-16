const db = require('../db/index')
const User = db.users
const Product = db.product
const Buyurtma = db.buyurtma
const bcrypt = require('bcrypt')

class UserService {
	async login(email, password) {
		if (!(email || password)) {
			return { error: 'Email yoki password kitirmadingiz' }
		}
		const data = await User.findOne({ where: { email } })
		if (!data) {
			return { error: 'Bunday foydalanuvchi royxatdan otmagan' }
		}
		const isPassword = await bcrypt.compare(password, data.password)
		if (!isPassword) {
			return { error: 'Parol xato' }
		}
		return { data }
	}

	async register(email, password, password2, firstName, lastName) {
		try {
			if (password !== password2) {
				throw new Error('Parollar mos emas!!')
			}
			const userExcist = await User.findOne({ where: { email } })
			if (userExcist) {
				throw new Error('Ushbu email bn royxatdan otilgan')
			}
			if (!firstName) {
				throw new Error('Ismingizni kiritmadingiz')
			}
			const hashPassword = await bcrypt.hash(password, 10)
			await User.create({
				email,
				password: hashPassword,
				firstName,
				lastName,
			})
		} catch (error) {
			console.log(error)
		}
	}

	async update(email, password2, password, firstName, lastName, id) {
		const user = await User.findByPk(id)
		if (!user) {
			return { error: 'User mavjud emas' }
		}
		const isPassword = await bcrypt.compare(password2, user.password)
		if (!isPassword) {
			return { error: 'Parol xato' }
		}
		const hashPassword = await bcrypt.hash(password, 10)
		await User.update(
			{ email, password: hashPassword, firstName, lastName },
			{ where: { id } }
		)
		const data = await User.findOne({ where: { email } })
		return { sucess: 'Muffafiqiyatli', data }
	}

	async myProfile(id) {
		const data = await Product.findAll({ where: { userId: id }, raw: true })
		return data
	}

	async userProfile(id) {
		const data = await User.findByPk(id, { raw: true })
		const product = await Product.findAll({ where: { userId: id } })
		return { data, product }
	}
}

module.exports = new UserService()
