const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para listar produtos
router.get('/', productController.listProducts);

// Rota para exibir o formulário de criação de produto
router.get('/add', productController.showAddProductForm);

// Rota para criar um novo produto
router.post('/', productController.createProduct);

// Rota para exibir o formulário de edição de produto
router.get('/edit/:id', productController.showEditProductForm);

// Rota para atualizar um produto
router.post('/edit/:id', productController.updateProduct);

// Rota para deletar um produto
router.post('/delete/:id', productController.deleteProduct);

// Redirecionar a raiz para a lista de produtos
router.get('/', (req, res) => {
  res.redirect('/');
});

module.exports = router;