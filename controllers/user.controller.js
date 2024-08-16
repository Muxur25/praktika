const userService = require('../service/user.service')
const { validationResult } = require('express-validator')

class UserController {
	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.render('auth/login', {
					title: 'login',
					isAuth: req.session.isAuth,
					yoqlama: errors.array()[0].msg,
					oldValue: {
						email,
						password,
					},
				})
			}

			const { data, error } = await userService.login(email, password)
			if (error) {
				return res.render('auth/login', {
					title: 'login',
					isAuth: req.session.isAuth,
					yoqlama: error,
					oldValue: {
						email,
						password,
					},
				})
			}
			req.session.user = data
			req.session.isAuth = true
			req.session.save(err => {
				if (err) throw err
				res.redirect('/product/my')
			})
		} catch (error) {
			next(error)
		}
	}

	async register(req, res, next) {
		try {
			const { email, password, password2, firstName, lastName } = req.body
			const error = validationResult(req)
			if (!error.isEmpty()) {
				return res.render('auth/register', {
					title: 'Register page',
					isAuth: req.session.isAuth,
					error: error.array()[0].msg,
					oldValue: {
						email,
						firstName,
						lastName,
					},
				})
			}
			await userService.register(
				email,
				password,
				password2,
				firstName,
				lastName
			)
			res.redirect('/user/l/login')
		} catch (error) {
			next(error)
		}
	}

	async logOut(req, res, next) {
		try {
			req.session.destroy(err => {
				if (err) throw err
				res.redirect('/user/l/login')
			})
		} catch (error) {
			next(error)
		}
	}

	async loginPage(req, res, next) {
		try {
			res.render('auth/login', {
				title: 'Login page',
				isAuth: req.session.isAuth,
				errorPass: req.flash('error'),
			})
		} catch (error) {
			next(error)
		}
	}

	async registerPage(req, res, next) {
		try {
			res.render('auth/register', {
				title: 'Register page',
			})
		} catch (error) {
			next(error)
		}
	}

	async updateUser(req, res, next) {
		try {
			const { email, password2, password, firstName, lastName } = req.body
			const id = req.session.user.id
			const { error, sucess, data } = await userService.update(
				email,
				password2,
				password,
				firstName,
				lastName,
				id
			)

			if (error) {
				return res.render('auth/update-profile', {
					title: error,
					error,
					oldValue: {
						email,
						firstName,
						lastName,
						password,
					},
				})
			}

			if (sucess) {
				req.session.user = data
				req.session.save()
				res.redirect('/user/my')
			}
		} catch (error) {
			next(error)
		}
	}

	async updatePage(req, res, next) {
		try {
			res.render('auth/update-profile', {
				title: 'Update profile',
				oldValue: {
					email: req.session.user.email,
					firstName: req.session.user.firstName,
					lastName: req.session.user.lastName,
				},
			})
		} catch (error) {
			next(error)
		}
	}

	async myProfile(req, res, next) {
		const data = await userService.myProfile(req.session.user.id)
		res.render('auth/my-profile', {
			title: 'My profile',
			firstName: req.session.user.firstName,
			lastName: req.session.user.lastName,
			email: req.session.user.email,
			data: data.length,
			isAuth: req.session.isAuth,
		})
	}

	async userProfile(req, res, next) {
		try {
			const { id } = req.params
			const { data, product } = await userService.userProfile(id)
			res.render('auth/user-profile', {
				title: 'User profile',
				data,
				product: product.length,
				isAuth: req.session.isAuth,
			})
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new UserController()
