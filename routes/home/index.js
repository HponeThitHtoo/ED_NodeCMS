const express = require('express');
const router = express.Router();
const { Post } = require('../../models/Post');
const { Category } = require('../../models/Category');
const { User } = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// for all routes of home(main) >>  "/*** "
router.all('/*', (req, res, next) => {
  // set the default layout for home routes
  req.app.locals.layout = 'home';
  next();
});

router.get('/', (req, res) => {
  /* req.session.edwin = 'Edwin Diaz';

  if (req.session.edwin) {
    console.log(`we found ${req.session.edwin}`);
  } */

  const perPage = 1;
  const page = req.query.page || 1;

  Post.find({})
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .then(posts => {
    Post.countDocuments().then(postCount => {

      Category.find({}).then(categories => {
        res.render('home/index', { 
          posts, 
          categories,
          current: parseInt(page),
          pages: Math.ceil(postCount / perPage),
        });
      });

    });

  });
});

router.get('/about', (req, res) => {
  res.render('home/about');
});

router.get('/login', (req, res) => {
  res.render('home/login');
});

// APP LOGIN

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  // console.log(password);

  User.findOne({email: email}).then(user => {
    // user.testMethod();

    if (!user) return done(null, false, {message: 'No user found'});

    bcrypt.compare(password, user.password, (err, matched) => {
      if (err) return err;

      if (matched) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
    
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

router.get('/register', (req, res) => {
  res.render('home/register');
});

router.post('/register', (req, res) => {
  let errors = [];

  if (!req.body.firstName) {
    errors.push({ message: 'please fill a first name' });
  }

  if (!req.body.lastName) {
    errors.push({ message: 'please fill a last name' });
  }

  if (!req.body.email) {
    errors.push({ message: 'please fill an email' });
  }

  if (!req.body.password) {
    errors.push({ message: 'please fill password' });
  }

  if (!req.body.passwordConfirm) {
    errors.push({ message: 'please fill confirm password' });
  }

  if (req.body.password !== req.body.passwordConfirm) {
    errors.push({ message: "password fields don't match" });
  }

  if (errors.length > 0) {

    res.render('home/register', { 
      errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

  } else {

    User.findOne({email: req.body.email}).then(user => {
      if (user) {
        req.flash('error_message', 'That email exist please login');
        res.redirect('/login');
      } else {

        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
    
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            
            newUser.save().then(savedUser => {
              // res.send('User was saved');
              req.flash('success_message', 'You are now registered, please login');
              res.redirect('/login');
            });
          });
        });

      }
    });
  }

});

router.get('/post/:slug', (req, res) => {
  Post.findOne({slug: req.params.slug})
  .populate({path: 'comments', match: {approveComment: true}, populate: {path: 'user', model: 'User'}}) // for comment and comment's user
  .populate('user') // for post's user
  .then(post => {

    Category.find({}).then(categories => {
      res.render('home/post', { post, categories });
    });
    
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;