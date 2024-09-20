const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para listar produtos
router.get('/products', productController.listProducts);

// Rota para exibir o formulário de criação de produto
router.get('/products/add', productController.showAddProductForm);

// Rota para criar um novo produto
router.post('/products', productController.createProduct);

// Rota para exibir o formulário de edição de produto
router.get('/products/edit/:id', productController.showEditProductForm);

// Rota para atualizar um produto
router.post('/products/edit/:id', productController.updateProduct);

// Rota para deletar um produto
router.post('/products/delete/:id', productController.deleteProduct);

// Redirecionar a raiz para a lista de produtos
router.get('/', (req, res) => {
  res.redirect('/products');
});

module.exports = router;