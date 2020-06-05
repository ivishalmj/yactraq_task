const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport= require('passport');


//User model
const User = require('../models/User');

//Login
router.get('/login',(req,res)=>{
    res.render("login");
});
//Register
router.get('/register',(req,res)=>{
    res.render("register");
});

//---------------------------Register Handle---------------------------
router.post('/register',(req,res) =>{
    const { name,email,password,password2 }= req.body;
    let errors =[];
    //Fullfill all the details
    if(!name || !email || !password || !password2){
        errors.push({msg:'fill the deatils'});
    }
    //Password Check
    if(password !== password2){
        errors.push({msg:'password not match'});
    }
    //password length
    if(password.length < 6){
        errors.push({msg:'password must be 6 char long'});
    }
    //
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //validate user
        User.findOne({email:email})
        .then(user =>{
            if(user){
                //user exist
                errors.push({msg:'Email already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                 const newUser = new User({
                     name,
                     email,
                     password
                 });
            //Hass Password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                //hash password
                newUser.password = hash;
                //save user
                newUser.save()
                .then(user => {
                    req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                      );
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            }))
            }
        });
    }
});

//------------------------Login Handle------------------------
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
});

//------------------logout Handle------------------------------
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});


module.exports=router;