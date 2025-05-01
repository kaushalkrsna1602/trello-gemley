const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createCard,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');

router.post('/', auth(), createCard);
router.patch('/:id', auth(), updateCard);
router.delete('/:id', auth(), deleteCard);

module.exports = router;
