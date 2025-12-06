const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const path=require('path');
const flash=require('connect-flash');
const expressSesion=require('express-session');
const crypto=require('crypto');


require("dotenv").config();

const shopRouter = require('./routes/shopRouter');const ownersRouter=require('./routes/ownersRouter');
const usersRouter=require('./routes/usersRouter');
const productsRouter=require('./routes/productsRouter');
const indexRouter = require('./routes/index');

const db=require('./config/mongoose-connection');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(
    expressSesion({
        resave:false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use("/", indexRouter);
app.use("/owners",ownersRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);
//app.use('/shop', shopRouter);

app.listen(3000);