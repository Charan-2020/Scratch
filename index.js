const express = require('express');
const router = express.Router();
const isloggedin=require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error,loggedin:false });
});

router.get('/shop',isloggedin,async function(req,res){
   let products=await productModel.find();
   let success=req.flash("success");
    res.render('shop',{products,success});
});

router.get('/cart', isloggedin, async function(req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate('cart');

        const cartItems = user.cart.map(item => {
            let netTotal = Number(item.price) + 20 - Number(item.discount);
            return { ...item._doc, netTotal }; // Spread operator to include all item properties
        });

        res.render('cart', { user, cartItems });
    } catch (err) {
        console.log(err.message);
        req.flash('error', 'Something went wrong while fetching your cart.');
        res.redirect('/shop');
    }
});



router.get('/addtocart/:productid',isloggedin,async function(req,res){
let user= await userModel.findOne({email:req.user.email});
user.cart.push(req.params.productid);
await user.save();
req.flash("success","Added to cart");
res.redirect('/shop');
 })

module.exports = router;