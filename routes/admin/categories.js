const express = require('express');
const router = express.Router();
const { Category } = require('../../models/Category');
const { userAuthenticated } = require('../../helpers/authentication');

// for all routes of "categories/*** */"
router.all('/*', userAuthenticated, (req, res, next) => {
  // set the default layout for admin routes
  req.app.locals.layout = 'admin';
  next();
});

// >>> /categories/
router.get('/', (req, res) => { // '/' is ok, cause in app.js we already used middleware ('/admin')
  Category.find({}).then(categories => {
    res.render('admin/categories', { categories });
  }).catch(err => {
    console.log(err);
  });
});

router.post('/create', (req, res) => {
  const newCategory = new Category({
    name: req.body.name,
  });

  newCategory.save().then(savedCategory => {
    res.redirect('/admin/categories');
  }).catch(err => console.log(err));

});

router.get('/edit/:id', (req, res) => {
  Category.findOne({_id: req.params.id}).then(category => {
    res.render('admin/categories/edit', { category });
  }).catch(err => {
    console.log(err);
  });
});

router.put('/edit/:id', (req, res) => {
  Category.findOne({_id: req.params.id}).then(category => {
    category.name = req.body.name;

    category.save().then(savedCategory => {
      res.redirect('/admin/categories');
    });
  }).catch(err => console.log(err));
});

router.delete('/:id', (req, res) => {
  Category.findByIdAndDelete(req.params.id).then(deletedCategory => {
    res.redirect('/admin/categories');
  }).catch(err => console.log(deletedCategory));
});

module.exports = router;