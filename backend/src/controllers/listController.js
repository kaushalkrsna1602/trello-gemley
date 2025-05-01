const List = require('../models/List');
const Board = require('../models/Board');

exports.createList = async (req, res) => {
  const { name, boardId } = req.body;
  try {
    const list = new List({ name, boardId, cardIds: [] });
    await list.save();

    await Board.findByIdAndUpdate(boardId, { $push: { listIds: list._id } });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    await Board.findByIdAndUpdate(list.boardId, { $pull: { listIds: list._id } });
    res.json({ msg: 'List deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
