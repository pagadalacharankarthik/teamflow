const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    projectId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'submitted', 'approved', 'overdue'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline']
    },
    submission: {
        link: String,
        notes: String,
        submittedAt: Date
    },
    approval: {
        approvedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        approvedAt: Date
    },
    activityLog: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Automatically mark as overdue if past deadline and not approved
taskSchema.pre('save', function() {
    const now = new Date();
    const deadline = new Date(this.deadline);
    
    // If overdue and not approved/submitted, update status and priority
    if (deadline < now && !['approved', 'submitted'].includes(this.status)) {
        this.status = 'overdue';
        this.priority = 'critical';
    } else if (!this.priority) {
        // Only auto-calculate priority if not set manually
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 2) {
            this.priority = 'high';
        } else if (diffDays < 5) {
            this.priority = 'medium';
        } else {
            this.priority = 'low';
        }
    }
});

module.exports = mongoose.model('Task', taskSchema);
