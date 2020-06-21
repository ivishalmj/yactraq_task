const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

//Passsport Config
require('./config/passport')(passport);
// db config
//const db = require('./config/db').MongoURI;
//connect to mongo
mongoose.connect("mongodb://loginDB:loginDB@localhost:27017/loginDB",{ useNewUrlParser: true })
.then(()=>console.log('connected to DB'))
.catch(err=>console.log(err));
//EJS




app.use(expressLayout);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Running on port ${PORT}`));