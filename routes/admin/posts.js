const express = require('express');
const router = express.Router();
const { Post } = require('../../models/Post');
const { Category } = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const { userAuthenticated } = require('../../helpers/authentication');

// for all routes of "admin/posts/*** */"
router.all('/*', userAuthenticated, (req, res, next) => {
  // set the default layout for admin/posts routes
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  // res.send(`IT WORKS`);
  // res.render('admin/posts'); // index.hbs

  Post.find({})
  .populate('category')
  .then(posts => {
    res.render('admin/posts', { posts: posts });
  });
});

router.get('/my-posts', (req, res) => {
  Post.find({ user: req.user.id }).populate('category').then(posts => {
    res.render('admin/posts/my-posts', { posts });
  });
});

router.get('/create', (req, res) => {
  Category.find({}).then(categories => {
    res.render('admin/posts/create', { categories });
  });
});

router.post('/create', (req, res) => {
  // console.log(req.body);
  // console.log(req.files);

  let errors = [];

  // checks input fields
  if (!req.body.title) {
    errors.push({message: 'please add a title'});
  }

  if (!req.body.body) {
    errors.push({message: 'please add a description'});
  }

  // if any input field is empty, show error message
  if (errors.length > 0) {
    res.render('admin/posts/create', {
      errors: errors
    });

  } else { // if no error, proceed the process

    let fileName = 'BMW-Z4.jpg'; // putting default image
  
    if (!isEmpty(req.files)) {
      let file = req.files.file;
      fileName = Date.now() + '-' + file.name;
    
      file.mv('./public/uploads/' + fileName, (err) => {
        if (err) throw err;
      });
  
      // console.log('not empty');
    }
  
  
    let allowComments = true;
  
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    } 
  
    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      category: req.body.category,
      file: fileName,
    });
  
    newPost.save().then(savedPost => {
      // console.log(savedPost);
      req.flash('success_message', `Post "${savedPost.title}" was created successfully`);
      res.redirect('/admin/posts'); // redirect is route
    }).catch(error => {
      // res.render('admin/posts/create', {errors: error.errors}); // render is view
      // console.log(error, 'could not save post');
      console.log(JSON.stringify(error,{}, 2));
    });
  
    // console.log(req.body.allowComments);
  }

});

router.get('/edit/:id', (req, res) => {
  // res.send(req.params.id);
  Post.findOne({_id: req.params.id}).then(post => {
    // console.log(JSON.stringify(post, {}, 2));
    Category.find({}).then(categories => {
      // console.log(JSON.stringify(categories, {}, 2));
      res.render('admin/posts/edit', { post: post, categories: categories });
    });
  });
});

router.put('/edit/:id', (req, res) => {
  // res.send('It Works');

  let allowComments = true;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  Post.findOne({_id: req.params.id}).then(post => {
    post.user = req.user.id;
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      let fileName = Date.now() + '-' + file.name;
      post.file = fileName;
    
      file.mv('./public/uploads/' + fileName, (err) => {
        if (err) throw err;
      });
  
      // console.log('not empty');
    }

    post.save().then(updatedPost => {
      req.flash('success_message', 'Post was successfully updated');
      res.redirect('/admin/posts/my-posts');
    });
  });

  /* let title = req.body.title;
  let status = req.body.status;
  let body = req.body.body; */

  /* Post.findOneAndUpdate({_id: req.params.id}, {
    $set:{
      title : req.body.title,
      status : req.body.status,
      allowComments : allowComments,
      body : req.body.body,
    }
  }, {new: true}).then(updatedPost => {
    res.redirect('/admin/posts');
  }); */
});

router.delete('/:id', (req, res) => {
  /* Post.remove({_id: req.params.id}).then(result => {
    res.redirect('/admin/posts');
  }); */
  
  /* 
  // delete document
  Post.findByIdAndRemove(req.params.id).then(removedPost => {
    // console.log(removedPost);
    // console.log(uploadDir);

    // delete the file
    fs.unlink(uploadDir + removedPost.file, (err) => {
      // console.log('ok');
      req.flash('success_message', 'Post was successfully deleted');
      res.redirect('/admin/posts');
    });
  })
   */

   Post.findOne({_id: req.params.id})
   .populate('comments')
   .then(post => {
      // check if defalut photo
      if (post.file !== 'BMW-Z4.jpg') {

        // delete the file
        fs.unlink(uploadDir + post.file, (err) => {
   
          // check that the comments exist for that post
          if (!post.comments.length < 1) {
            // loop comments
            post.comments.forEach(comment => {
             // delete comment
             comment.remove();
            });
          }
   
          // delete document
          post.remove().then(removedPost => {
            req.flash('success_message', 'Post was successfully deleted');
            res.redirect('/admin/posts/my-posts');
          });
   
         });
      } else {
        // check that the comments exist for that post
        if (!post.comments.length < 1) {
          // loop comments
          post.comments.forEach(comment => {
           // delete comment
           comment.remove();
          });
        }
 
        // delete document
        post.remove().then(removedPost => {
          req.flash('success_message', 'Post was successfully deleted');
          res.redirect('/admin/posts/my-posts');
        });
      }

   });
});

module.exports = router;