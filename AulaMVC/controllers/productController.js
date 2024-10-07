const db = require('../models');
const Product = db.Product;

// Exibir a lista de produtos
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('products', { products });
  } catch (err) {
    res.status(500).send('Erro ao buscar produtos: ' + err.message);
  }
};

// Adicionar um novo produto
exports.showAddProductForm = (req, res) => {
  res.render('addProduct'); //form em views
};

// Criar um novo produto
exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  try {
    await Product.create({ name, price, description });
    res.redirect('/products');
  } catch (err) {
    res.status(500).send('Erro ao criar produto: ' + err.message);
  }
};
// Exibir formulário para editar um produto
exports.showEditProductForm = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    if (product) {
      res.render('editProduct', { product }); //form em views
    } else {
      res.status(404).send('Produto não encontrado');
    }
  } catch (err) {
    res.status(500).send('Erro ao buscar produto: ' + err.message);
  }
};
// Atualizar um produto
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, description } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({ name, price, description });
      res.redirect('/products');
    } else {
      res.status(404).send('Produto não encontrado');
    }
  } catch (err) {
    res.status(500).send('Erro ao atualizar produto: ' + err.message);
  }
};
// Deletar um produto
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.redirect('/products');
    } else {
      res.status(404).send('Produto não encontrado');
    }
  } catch (err) {
    res.status(500).send('Erro ao deletar produto: ' + err.message);
  }
};
