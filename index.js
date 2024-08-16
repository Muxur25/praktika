require('dotenv').config()

const express = require('express')
const db = require('./db/index')
const session = require('express-session')
const pgStore = require('connect-pg-simple')(session)
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const csrft = require('csurf')
const productController = require('./controllers/product.controller')
const app = express()

app.use(
	session({
		secret: 'qalisan dalbas',
		resave: false,
		saveUninitialized: false,
		store: new pgStore({
			pool: require('./db/pool'),
			tableName: 'user_session',
		}),
	})
)
app.use(express.urlencoded({ extended: true }))

app.use(flash())

app.use(express.json())

app.engine('.hbs', handlebars.engine({ extname: '.hbs' }))

app.set('view engine', '.hbs')

app.use('/product', require('./routers/product.router'))

// app.use(csrft())
// app.use((req, res, next) => {
// 	res.locals.csrfToken = req.csrfToken()
// 	next()
// })
app.use('/user', require('./routers/users.router'))

app.use('/', async (req, res) => {
	try {
		if (req.session.isAuth) {
			return res.redirect('/product/my')
		}
		res.redirect('/product/all?page=1')
	} catch (error) {
		console.log(error)
	}
})

const bootstrap = async () => {
	app.listen(process.env.PORT)
	await db.sequelize.sync()
}

bootstrap()
