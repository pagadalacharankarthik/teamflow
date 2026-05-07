const express = require('express');
const { 
    getTasks, 
    createTask, 
    updateStatus, 
    submitTask, 
    approveTask 
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(authorize('admin'), createTask);

router.put('/:id/status', updateStatus);
router.put('/:id/submit', submitTask);
router.put('/:id/approve', authorize('admin'), approveTask);

module.exports = router;
