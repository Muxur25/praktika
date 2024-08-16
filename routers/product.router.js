const express = require('express')
const productController = require('../controllers/product.controller')
const { procAuth, borUser } = require('../middleware/user')

const router = express.Router()

router.post('/add', procAuth, productController.add)

router.post('/update/:id', procAuth, productController.update)

router.post('/delete/:id', procAuth, productController.delete)

router.get('/my', procAuth, productController.myProduct)

router.get('/update/page/:id', procAuth, productController.updatePage)

router.get('/one/:id', borUser, productController.oneProductPage)

router.get('/my-one/:id', procAuth, productController.myOne)

router.post('/comment/:id', borUser, productController.addComment)

router.get('/all', borUser, productController.getAllProduct)

router.post('/buyurtma/:id', productController.buyurtma)

router.get('/all-buyurtmalar', procAuth, productController.buyurtmalar)

router.post('/sotildi/:id', procAuth, productController.sotildi)

router.post('/bekor/:id', procAuth, productController.bekor)

router.post('/comment/delete/:id', procAuth, productController.deleteComment)

module.exports = router
