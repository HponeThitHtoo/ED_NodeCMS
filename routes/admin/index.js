const express = require('express');
const router = express.Router();
const faker = require('faker');
const { Post } = require('../../models/Post');
const { userAuthenticated } = require('../../helpers/authentication');
const { Comment } = require('../../models/Comment');
const { Category } = require('../../models/Category');
const { User } = require('../../models/User');

// for all routes of "admin/*** */"
router.all('/*', (req, res, next) => {
  // set the default layout for admin routes
  req.app.locals.layout = 'admin';
  next();
});

// >>> admin/
router.get('/', (req, res) => { // '/' is ok, cause in app.js we already used middleware ('/admin')
  /* Post.countDocuments({}).then(postCount => {
    Comment.countDocuments({}).then(commentCount => {
      Category.countDocuments({}).then(categoryCount => {
        User.countDocuments({}).then(userCount => {
          res.render('admin/index', {postCount, commentCount, categoryCount, userCount});
        });
      });
    });
  }); */

  const promises = [
    Post.countDocuments().exec(),
    Comment.countDocuments().exec(),
    Category.countDocuments().exec(),
    User.countDocuments().exec(),
  ];

  Promise.all(promises).then(([postCount, commentCount, categoryCount, userCount]) => {
    res.render('admin/index', {postCount, commentCount, categoryCount, userCount});
  });
});

// >>> admin/dashboard
/* router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
}); */

router.post('/generate-fake-posts', (req, res) => {
  for (let i = 0; i < req.body.amount; i++) {
    let post = new Post();

    post.title = faker.name.title();
    post.status = 'public';
    post.allowComments = faker.random.boolean();
    post.body = faker.lorem.sentence();
    post.slug = faker.name.title();

    post.save().then(savedPost => {});

    /* post.save(function(err) {
      if (err) throw err;
    }); */

  }
  res.redirect('/admin/posts');
});

module.exports = router;