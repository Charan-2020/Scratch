const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn'); // Ensure this path is correct
const productModel = require('../models/product-model'); // Ensure this path is correct

router.get('/shop', isLoggedIn, async (req, res) => {
    try {
        const products = await productModel.find({});
        res.render('shop', { user: req.user, products });
    } catch (err) {
        console.log(err.message);
        req.flash('error', 'Something went wrong while fetching products.');
        res.redirect('/');
    }
});

module.exports = router;
