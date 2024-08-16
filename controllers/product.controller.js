const productService = require('../service/product.service')

class Product {
	async add(req, res, next) {
		try {
			const { title, image, description, amount } = req.body
			if (title.length <= 3 || description.length <= 3) {
				req.flash(
					'error',
					'title yoki description uzunligi 3 tadan kop bolish kere'
				)
				return res.redirect('/product/my')
			}
			const { id } = req.session.user
			await productService.add(title, image, description, amount, id)
			res.redirect('/product/my')
		} catch (error) {
			console.log(error)
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params
			await productService.delete(id)
			res.redirect('/product/my')
		} catch (error) {
			next(error)
		}
	}

	async update(req, res, next) {
		try {
			const { title, image, description, amount } = req.body
			const { id } = req.params
			const { massage } = await productService.update(
				title,
				image,
				description,
				amount,
				id
			)
			if (massage) {
				res.redirect('/product/my')
			}
		} catch (error) {
			next(error)
		}
	}

	async updatePage(req, res, next) {
		try {
			const data = await productService.updatePage(req.params.id)
			res.render('product/update-product', {
				title: 'Update Product',
				data,
				isAuth: req.session.isAuth,
			})
		} catch (error) {
			next(error)
		}
	}

	async myProduct(req, res, next) {
		try {
			const data = await productService.myProduct(req.session.user.id)
			res.render('product/my-product', {
				title: 'My product',
				isAuth: req.session.isAuth,
				data,
			})
		} catch (error) {
			console.log(error)
		}
	}

	async oneProductPage(req, res, next) {
		try {
			const product = await productService.oneProduct(req.params.id)

			res.render('product/one-product', {
				title: 'One product',
				product,
				isAuth: req.session.isAuth,
				comment: product.comments,
			})
		} catch (error) {
			next(error)
		}
	}

	async myOne(req, res, next) {
		try {
			const product = await productService.oneProduct(req.params.id)
			res.render('product/my-one', {
				title: 'One product',
				product,
				isAuth: req.session.isAuth,
				comment: product.comments,
			})
		} catch (error) {
			next(error)
		}
	}

	async addComment(req, res, next) {
		try {
			const { email, text } = req.body
			await productService.addComment(req.params.id, email, text)
			res.redirect('/product/one/' + req.params.id)
		} catch (error) {
			next(error)
		}
	}

	async getAllProduct(req, res, next) {
		try {
			const paganetion = +req.query.page
			const limits = 4
			const { data, totalData } = await productService.getAllProduct(
				paganetion,
				limits
			)
			console.log(data)
			console.log(totalData)

			const lastPage = Math.ceil(totalData / limits)
			res.render('product/all-product', {
				title: 'All product',
				isAuth: req.session.isAuth,
				data,
				totalData,
				nextPage: paganetion + 1,
				previPage: paganetion - 1,
				hasNextPage: paganetion * limits < totalData,
				hasPrevisePage: paganetion - 1,
				lastPage,
				currentPage: paganetion,
				currentNotOne: paganetion !== 1 && paganetion - 1 !== 1,
				lastPageCheking: lastPage !== paganetion && paganetion + 1 !== lastPage,
			})
		} catch (error) {
			next(error)
		}
	}

	async buyurtma(req, res, next) {
		try {
			const { fio, phone, region } = req.body
			const id = req.params.id
			await productService.buyurtma(fio, phone, region, id)
			res.render('product/qabul', {
				title: 'Buyurtma uchun rahmat',
			})
		} catch (error) {
			next(error)
		}
	}

	async buyurtmalar(req, res, next) {
		try {
			const data = await productService.buyurtmalar(req.session.user.id)
			let sotilgan = 0
			let bekor = 0

			data.forEach(product => {
				if (product.buyurtma.status == 'sotildi') {
					sotilgan++
				} else if (product.buyurtma.status == 'bekor qilindi') {
					bekor++
				}
			})

			let totalAmount = 0

			data.forEach(product => {
				if (product.buyurtma.status === 'sotildi') {
					totalAmount += product.amount
				}
			})

			let statusLa = null

			data.forEach(product => {
				if (
					product.buyurtma.status === 'sotildi' ||
					product.buyurtma.status === 'bekor qilindi'
				) {
					statusLa = false
				} else {
					statusLa = true
				}
			})

			res.render('product/buyurtma-product', {
				isAuth: req.session.isAuth,
				data,
				sotilgan,
				bekor,
				totalAmount,
				statusLa,
			})
		} catch (error) {
			next(error)
		}
	}

	async bekor(req, res, next) {
		try {
			const id = req.params.id
			await productService.bekor(id)
			res.redirect('/product/all-buyurtmalar')
		} catch (error) {
			next(error)
		}
	}

	async sotildi(req, res, next) {
		try {
			const id = req.params.id
			await productService.sotildi(id)
			res.redirect('/product/all-buyurtmalar')
		} catch (error) {
			next(error)
		}
	}

	async deleteComment(req, res, next) {
		try {
			const id = req.params.id
			await productService.deleteComment(id)
			res.redirect('/product/my/')
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new Product()
