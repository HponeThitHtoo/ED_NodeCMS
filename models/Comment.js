const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  body : {
    type: String,
    required: true,
  },

  approveComment: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now(),
  }

});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };