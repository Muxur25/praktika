const express = require('express')

const userController = require('../controllers/user.controller')
const router = express.Router()
const { body } = require('express-validator')
const { borUser, procAuth } = require('../middleware/user')

router.post(
	'/login',
	body('email', 'Emailni togri kiriting').isEmail(),
	body('password', 'Password uzunligi talabga javob bermaydi').isLength({
		min: 5,
		max: 20,
	}),
	userController.login
)

router.post(
	'/register',
	body('email', 'Emailni togri kiriting').isEmail(),
	body('password', 'Password uzunligi talabga javob bermaydi').isLength({
		min: 5,
		max: 20,
	}),
	userController.register
)

router.get('/logout', procAuth, userController.logOut)

router.get('/l/login', borUser, userController.loginPage)

router.get('/l/register', borUser, userController.registerPage)

router.post('/update/action', procAuth, userController.updateUser)

router.get('/update', procAuth, userController.updatePage)

router.get('/my', procAuth, userController.myProfile)

router.get('/profile/:id', procAuth, userController.userProfile)

module.exports = router
