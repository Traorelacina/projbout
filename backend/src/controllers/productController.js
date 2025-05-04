const Product = require('../../models/productModel');
const upload = require('../../src/middlewares/upload');
const path = require('path');
const fs = require('fs');

// @desc    Récupérer tous les produits
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// @desc    Récupérer un produit par son ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// @desc    Créer un produit avec upload d'image
// @route   POST /api/products
// @access  Public
exports.createProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Veuillez uploader une image' 
        });
      }

      const { name, description, price, oldPrice, category, rating, stock, isNew, isPromo } = req.body;

      const product = new Product({
        name,
        description,
        price,
        oldPrice: oldPrice || undefined,
        category,
        image: `/uploads/${req.file.filename}`,
        rating: rating || 0,
        stock,
        isNew: isNew === 'true',
        isPromo: isPromo === 'true'
      });

      await product.save();

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      // Supprimer le fichier uploadé en cas d'erreur
      if (req.file) {
        fs.unlink(path.join(__dirname, '../../uploads', req.file.filename), (err) => {
          if (err) console.error('Erreur suppression fichier:', err);
        });
      }

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
];

// @desc    Mettre à jour un produit
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      // Si nouvelle image est uploadée
      if (req.file) {
        // Supprimer l'ancienne image
        if (product.image) {
          const oldImagePath = path.join(__dirname, '../../uploads', product.image.split('/uploads/')[1]);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Erreur suppression ancienne image:', err);
          });
        }
        req.body.image = `/uploads/${req.file.filename}`;
      }

      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      // Supprimer le nouveau fichier uploadé en cas d'erreur
      if (req.file) {
        fs.unlink(path.join(__dirname, '../../uploads', req.file.filename), (err) => {
          if (err) console.error('Erreur suppression fichier:', err);
        });
      }

      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
];

// @desc    Supprimer un produit
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Supprimer l'image associée
    if (product.image) {
      const imagePath = path.join(__dirname, '../../uploads', product.image.split('/uploads/')[1]);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Erreur suppression image:', err);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};