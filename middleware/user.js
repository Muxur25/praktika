const procAuth = (req, res, next) => {
	if (!req.session.isAuth) {
		res.redirect('/product/all?page=1')
	}
	next()
}

const borUser = (req, res, next) => {
	if (req.session.isAuth) {
		res.redirect('/product/my')
	}
	next()
}

module.exports = { procAuth, borUser }
