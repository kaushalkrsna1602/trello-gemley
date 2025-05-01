const Card = require('../models/Card');
const List = require('../models/List');

exports.createCard = async (req, res) => {
  const { title, description, listId, assignedTo, dueDate } = req.body;
  try {
    const card = new Card({ title, description, listId, assignedTo, dueDate });
    await card.save();

    await List.findByIdAndUpdate(listId, { $push: { cardIds: card._id } });
    res.json(card);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(card);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    await List.findByIdAndUpdate(card.listId, { $pull: { cardIds: card._id } });
    res.json({ msg: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
