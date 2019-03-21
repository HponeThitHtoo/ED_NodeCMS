const express = require('express');
const router = require('express').Router();
const { Post } = require('../../models/Post');
const { Comment } = require('../../models/Comment');

// for all routes of "admin/comments/*** */"
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Comment.find({user: req.user.id})
  .populate('user')
  .then(comments => {
    res.render('admin/comments', { comments });
  });

  /* Comment.find({user: '5c8fabf70bbc560798709c91'})
  .populate('user')
  .then(comments => {
    res.render('admin/comments', { comments });
  }); */
});

router.post('/', (req, res) => {
  Post.findOne({ _id: req.body.id }).then(post => {
    const newComment = new Comment({
      user: req.user.id, // this can be done because of passport npm package
      body: req.body.body,
    });

    post.comments.push(newComment);

    post.save().then(savedPost => {
      newComment.save().then(savedComment => {
        req.flash('success_message', 'Your comment will reviewed in a moment');
        res.redirect(`/post/${post.slug}`);
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  // Delete the comment
  Comment.findByIdAndRemove(req.params.id).then(deleteItem => {
    // find and update Post
    Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}).then(updatedPost => {
      res.redirect('/admin/comments');
    });
  }).catch(err => console.log(err));
});

router.post('/approve-comment', (req, res) => {
  /* console.log(req.body.id);
  console.log(req.body.approveComment); */

  Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result) => {
    if (err) return err;

    res.send(result);
  });
});

module.exports = router;