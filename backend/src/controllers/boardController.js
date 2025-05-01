const Board = require('../models/Board');
const List = require('../models/List');

exports.createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const board = new Board({ name, userIds: [req.user.id], listIds: [] });
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userIds: req.user.id });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate({
        path: 'listIds',
        populate: { path: 'cardIds' },
      });
    res.json(board);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

