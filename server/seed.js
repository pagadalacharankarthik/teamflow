const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Clear existing data
        await Task.deleteMany();
        await Project.deleteMany();
        
        const users = await User.find();
        if (users.length < 2) {
            console.log('Please register at least 2 users (1 admin, 1 member) before running seed.');
            process.exit();
        }

        const admin = users.find(u => u.role === 'admin') || users[0];
        const member = users.find(u => u.role === 'member') || users[1];

        console.log(`Seeding for Admin: ${admin.name} and Member: ${member.name}`);

        // 1. Create Projects
        const project1 = await Project.create({
            name: 'Website Redesign 2026',
            description: 'Full overhaul of the corporate website using Next.js and Tailwind CSS.',
            createdBy: admin._id,
            members: [admin._id, member._id]
        });

        const project2 = await Project.create({
            name: 'Mobile App Launch',
            description: 'Beta testing and deployment of the TeamFlow iOS and Android apps.',
            createdBy: admin._id,
            members: [admin._id, member._id]
        });

        const project3 = await Project.create({
            name: 'AWS Infrastructure Migration',
            description: 'Moving core services from on-premise to AWS Lambda and RDS.',
            createdBy: admin._id,
            members: [admin._id]
        });

        // 2. Create Tasks
        await Task.create([
            {
                title: 'Design Hero Section',
                description: 'Create a high-fidelity mockup for the new landing page hero component.',
                projectId: project1._id,
                assignedTo: member._id,
                status: 'approved',
                priority: 'medium',
                deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                activityLog: ['Task created', 'Submitted for review', 'Approved by Admin']
            },
            {
                title: 'Implement Auth Flow',
                description: 'Integrate JWT authentication with secure cookie storage.',
                projectId: project1._id,
                assignedTo: member._id,
                status: 'submitted',
                priority: 'high',
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                submission: {
                    link: 'https://github.com/example/repo/pull/42',
                    notes: 'Auth logic is complete, waiting for review.',
                    submittedAt: new Date()
                },
                activityLog: ['Task created', 'Moved to in-progress', 'Submitted for review']
            },
            {
                title: 'Q1 Security Patch',
                description: 'Urgent: Apply critical security updates to the production server.',
                projectId: project2._id,
                assignedTo: member._id,
                status: 'pending', // Will be changed to overdue by pre-save hook
                priority: 'critical',
                deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                activityLog: ['Task created']
            },
            {
                title: 'Provision RDS Cluster',
                description: 'Set up multi-AZ database instance with encrypted storage.',
                projectId: project3._id,
                assignedTo: admin._id,
                status: 'pending',
                priority: 'high',
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                activityLog: ['Infrastructure requirement defined']
            }
        ]);

        console.log('Seeding complete! 🚀');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
