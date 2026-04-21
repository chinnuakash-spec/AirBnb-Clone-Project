const User = require('../models/user.js');

//signup route
module.exports.renderSignupForm = async(req,res) =>{
    res.render("users/signup.ejs");
};

//reg user 
module.exports.singUp = async(req,res) =>{
    try{
        let {username,email,password} = req.body;
        const nUser = new User({email,username});
        const regUser = await User.register(nUser,password);
        req.login(regUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/lists');
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
};

//login route
module.exports.renderLoginForm =(req,res) => {
    res.render('users/login.ejs');
};

//post login route is in router/user.js because of passport authentication middleware.
module.exports.Login = async(req,res) =>{
    req.flash("success", "Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || '/lists';
    res.redirect(redirectUrl);
};

//logout route is in router/user.js because of passport logout method.
module.exports.Logout =(req,res,next) =>{
    req.logout((err) => {
        if(err){
            return next (err);
        }
    })
    req.flash("Success", "Logged out Successfully");
    res.redirect('lists');
};
