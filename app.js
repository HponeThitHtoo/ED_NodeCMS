const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const { mongoDbUrl } = require('./config/database');
const passport = require('passport');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise; // set mongoose promise to global promise

mongoose.connect(mongoDbUrl).then(data => {
  console.log('MONGO connected');
}).catch(error => console.log(error));

app.use(express.static(path.join(__dirname, 'public'))); // routes for public folder

const { select, generateDate, paginate } = require('./helpers/handlebars-helpers');

// Set View Engine
// app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.engine('hbs', exphbs({defaultLayout: 'home', extname: '.hbs', helpers: { select, generateDate, paginate }}));
app.set('view engine', 'hbs');

// Upload Middleware
app.use(upload());

// Body Parser
app.use(bodyParser.urlencoded({extended: true})); // entended: false >> key - value, if true, all encoded data
app.use(bodyParser.json()); // set middleware to use bodyParser.json()

// Method Override
app.use(methodOverride('_method'));

// Session Middleware
app.use(session({
  secret: 'edwindiaz123ilovecoding',
  resave: true,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash Message Middleware
app.use(flash());

// set local variables by using Middleware
app.use((req, res, next) => {
  // set application's local varible to req.user
  res.locals.user = req.user || null;
  // set application's local variable to flash message
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.form_errors = req.flash('form_errors');
  // set application's local variable to passport error message
  res.locals.error = req.flash('error');
  next();
});

// Load Routes
const home = require('./routes/home/index'); // import main routes
const admin = require('./routes/admin/index'); // import admin routes
const posts = require('./routes/admin/posts'); // import admin/posts routes
const categories = require('./routes/admin/categories'); // import admin/categories routes
const comments = require('./routes/admin/comments'); // import admin/comments routes

// Use Routes
app.use('/', home); // plug in main routes by middleware
app.use('/admin', admin); // plug in admin routes by middleware
app.use('/admin/posts', posts); // plug in admin/posts routes by middleware
app.use('/admin/categories', categories); // plug in admin/categories routes by middleware
app.use('/admin/comments', comments); // plug in admin/comments routes by middleware

const port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log(`listening on port 4500`);
});