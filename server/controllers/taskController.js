const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        let query;
        const companyId = req.user.company._id || req.user.company;
        if (req.user.role === 'admin') {
            query = Task.find({ company: companyId });
        } else {
            query = Task.find({ company: companyId, assignedTo: req.user.id });
        }

        const tasks = await query.populate('projectId assignedTo', 'name title');

        res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        
        // Verify that the project belongs to the user's company
        const project = await Project.findOne({ _id: req.body.projectId, company: companyId });
        if (!project) {
            return res.status(400).json({ success: false, message: 'Invalid Project or Project does not belong to your company' });
        }

        req.body.company = companyId;
        const task = await Task.create(req.body);

        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        let task = await Task.findOne({ _id: req.params.id, company: companyId });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Authorization check
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        task.status = req.body.status;
        task.activityLog.push(`Status updated to ${req.body.status} by ${req.user.name}`);
        
        await task.save();

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Submit task
// @route   PUT /api/tasks/:id/submit
// @access  Private
exports.submitTask = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        let task = await Task.findOne({ _id: req.params.id, company: companyId });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        task.status = 'submitted';
        task.submission = {
            link: req.body.link,
            notes: req.body.notes,
            submittedAt: Date.now()
        };
        task.activityLog.push(`Task submitted by ${req.user.name}`);

        await task.save();

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Approve task
// @route   PUT /api/tasks/:id/approve
// @access  Private/Admin
exports.approveTask = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        let task = await Task.findOne({ _id: req.params.id, company: companyId });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        task.status = 'approved';
        task.approval = {
            approvedBy: req.user.id,
            approvedAt: Date.now()
        };
        task.activityLog.push(`Task approved by ${req.user.name}`);

        await task.save();

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
