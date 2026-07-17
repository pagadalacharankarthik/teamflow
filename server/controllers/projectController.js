const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
    try {
        let projects;
        const companyId = req.user.company._id || req.user.company;
        if (req.user.role === 'admin') {
            projects = await Project.find({ company: companyId }).populate('members', 'name email');
        } else {
            projects = await Project.find({
                company: companyId,
                $or: [
                    { createdBy: req.user.id },
                    { members: req.user.id }
                ]
            }).populate('members', 'name email');
        }

        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        req.body.company = req.user.company._id || req.user.company;

        const project = await Project.create(req.body);
        const populatedProject = await Project.findById(project._id).populate('members', 'name email');

        res.status(201).json({ success: true, data: populatedProject });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/add-member
// @access  Private/Admin
exports.addMember = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        const project = await Project.findOne({ _id: req.params.id, company: companyId });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Check if user exists within the same company
        const user = await User.findOne({ email: req.body.email, company: companyId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found in your company' });
        }

        if (project.members.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User already a member' });
        }

        project.members.push(user._id);
        await project.save();

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        let project = await Project.findOne({ _id: req.params.id, company: companyId });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('members', 'name email');

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
    try {
        const companyId = req.user.company._id || req.user.company;
        const project = await Project.findOne({ _id: req.params.id, company: companyId });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        await project.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
