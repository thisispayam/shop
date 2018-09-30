const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config(); //using this library to have the .env file available to our server.js

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


//=========================================
//          Models
//=========================================

const {User} = require('./models/user');
const {Brand} = require('./models/brand');
const {Size} = require('./models/size');
const {Product} = require('./models/product');


//=========================================
//          Middlewares
//=========================================

const {auth} = require('./middleware/auth');
const { admin } = require('./middleware/admin');

//=========================================
//         Categories
//=========================================

//BRAND

//only authenticated users can post products
app.post('/api/product/brand',auth,admin,(req,res)=>{
    const brand = new Brand(req.body);

    brand.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success:true,
            brand: doc
        })
    })
})

//to fetch all the brands added to the db
app.get('/api/product/brands',(req,res)=>{
    Brand.find({},(err,brands)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(brands)
    })
})

//SIZE

app.post('/api/product/size',auth,admin,(req,res)=>{
    const size = new Size(req.body);

    size.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            size: doc
        })
    })
});

app.get('/api/product/sizes',(req,res)=>{
    Size.find({},(err,sizes)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(sizes)
    })
})

//=================================
//             PRODUCTS
//=================================

//#3
// BY ARRIVAL - latest listings - latest 4
// /articles?sortBy=createdAt&order=desc&limit=4

// BY SELL - top sells - top 5
// /articles?sortBy=sold&order=desc&limit=100&skip=5

//note: createdAt and sold exist in the db
//note: &limit=100&skip=5 : skip=5 means skip the first 5 and limit the 95 left

app.get('/api/product/articles',(req,res)=>{

    let order = req.query.order ? req.query.order : 'asc'; // if it's available use it if not order by asc
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"; // if it's available use it if not order by id
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Product.
    find().
    populate('brand').
    populate('size').
    sort([[sortBy,order]]).
    limit(limit).
    exec((err,articles)=>{
        if(err) return res.status(400).send(err);
        res.send(articles)
    })
})

//#2
//fetching products by id
/// /api/product/article?id=HSHSHSKSK,JSJSJSJS,SDSDHHSHDS,JSJJSDJ&type=single
app.get('/api/product/articles_by_id',(req,res)=>{
    let type = req.query.type; //whatever we have inside &type= / url gets encoded by bodyparser on top
    let items = req.query.id; // content inside ?id=

    if(type === "array"){
        let ids = req.query.id.split(','); // spliting the ids
        items = []; // we don't want to return ["HSHSHSKSK","JSJSJSJS", etc]/ we need mongoose objects
        items = ids.map(item=>{
            return mongoose.Types.ObjectId(item) // converting the ids to objectId from mongoose 
        })
    }
//#1
    //find a product(s) id check for their 'ref' inside db and return
    Product.
    find({ '_id':{$in:items}}).
    populate('brand').
    populate('size').
    exec((err,docs)=>{
        return res.status(200).send(docs)
    })
});


//adding product
app.get('/api/product/articles',auth,admin,(req,res)=>{
    const product = new Product(req.body);

    product.save((err,doc) => {
        if(err) return res.json({success:false, err});
        res.status(200).json({
            success:true,
            article: doc
        })
    })
})



//=========================================
//          USERS
//=========================================

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    })
})

app.post('/api/users/register', (req,res)=>{
    const user = new User(req.body);

    user.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login',(req,res)=>{
    User.findOne({'email':req.body.email},(err,user)=>{
        if(!user) return res.json({loginSuccess:false,message:'Auth failed, email not found'});

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) return res.json({loginSuccess:false,message:'Wrong password'});

            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('w_auth',user.token).status(200).json({
                    loginSuccess: true
                })
            })
        })
    })
})

//users gets logged out only if they are logged in - check auth
app.get('/api/user/logout',auth,(req,res)=>{
    //going to db
    User.findOneAndUpdate(
        { _id:req.user._id },
        { token: '' },
        (err,doc)=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true
            })
        }
    )
})

const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`Server Running at ${port}`);
})