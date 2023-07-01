const express = require('express');
const router = express.Router();
const { getGoals, createGoal, updateGoal, deleteGoals } = require('../controllers/goalsController')
const {protect} = require('../middleware/authMiddleware');

router.route('/').get(protect, getGoals).post(protect, createGoal);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoals);

// code on line 5 and 6 is the same as line 10 to 13

// router.get('/', getGoals)
// router.post('/', createGoal)
// router.put('/:id', updateGoal)
// router.delete('/:id', deleteGoals)

module.exports = router;