const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  listIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
});

module.exports = mongoose.model('Board', boardSchema);
