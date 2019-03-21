const URLSlugs = require('mongoose-url-slugs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },

  title: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: 'public'
  },

  allowComments: {
    type: Boolean,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  file: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  slug: {
    type: String,
  },

  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
}, { usePushEach: true }); // for comments

// plug in slug package to Mongoose Model
postSchema.plugin(URLSlugs('title', { field: 'slug' })); // 'title' => field for slug, 'slug' => field to slug inserted in

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };