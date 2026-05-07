const express = require('express');
const { getProjects, createProject, addMember, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getProjects)
    .post(authorize('admin'), createProject);

router.route('/:id')
    .put(authorize('admin'), updateProject)
    .delete(authorize('admin'), deleteProject);

router.post('/:id/add-member', authorize('admin'), addMember);

module.exports = router;
