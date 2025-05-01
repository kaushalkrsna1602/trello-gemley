const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
});

module.exports = mongoose.model('Card', cardSchema);
