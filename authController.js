const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const{generateToken} = require("../utils/generateToken")

module.exports.registerUser=async function(req,res){
    try {
        let { email, fullname, password } = req.body;
        let user=   await userModel.findOne({email:email});
        if(user) return res.status(401).send("you already have a account,please login");
         bcrypt.genSalt(10,function(err,salt){
           bcrypt.hash(password,salt,async function(err,hash){
               if(err) return res.send(err.message);
               else{
                   let user = await userModel.create({ email, fullname, password:hash });
               let token= generateToken(user)
                res.cookie("token",token);
                   res.send('user created successfully');                 
               };
           });
        })
       } catch (err) {
       console.log(err.message);
       res.status(500).send("Error during registration.");
   }
}

module.exports.loginUser = async function(req, res) {
    let { email, password } = req.body;
  
    try {
      let user = await userModel.findOne({ email: email });
      if (!user) return res.status(401).send("Email or Password incorrect");
  
      bcrypt.compare(password, user.password, function(err, result) {
        if (err) return res.status(500).send("Error comparing passwords.");
        
        if (result) {
          let token = generateToken(user);
  
          res.cookie("token", token, { httpOnly: true });
  
          
          let products = [
            { name: 'Product 1', image: '1bag.png', price: 500, bgcolor: 'grey', panelcolor: 'grey', textcolor: 'black' },
            { name: 'Product 2', image: '2bag.png', price: 400, bgcolor: 'blue', panelcolor: 'beige', textcolor: 'green' }
          ];
          res.redirect('/shop');
        } else {
          return res.status(401).send("Email or Password incorrect");
        }
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error during login.");
    }
  };

module.exports.logout=function(req,res){
    res.cookie("token","");
    res.redirect('/');
}  