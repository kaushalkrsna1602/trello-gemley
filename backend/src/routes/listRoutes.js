const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createList,
  updateList,
  deleteList,
} = require('../controllers/listController');

router.post('/', auth(), createList);
router.patch('/:id', auth(), updateList);
router.delete('/:id', auth(), deleteList);

module.exports = router;
