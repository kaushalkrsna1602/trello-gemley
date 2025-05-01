const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createBoard,
  getUserBoards,
  getBoardById,
  deleteBoard,
} = require('../controllers/boardController');

router.post('/', auth(), createBoard);
router.get('/', auth(), getUserBoards);
router.get('/:id', auth(), getBoardById);
router.delete('/:id', auth(), deleteBoard);

module.exports = router;
