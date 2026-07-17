const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Company = require('./models/Company');

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for migration...');

        // 1. Check if default company exists
        let defaultCompany = await Company.findOne({ code: 'COMP-000000' });
        if (!defaultCompany) {
            defaultCompany = await Company.create({
                name: 'TeamFlow Default Workspace',
                code: 'COMP-000000'
            });
            console.log('Created default company: COMP-000000');
        }

        // 2. Migrate Users
        const usersResult = await User.updateMany(
            { company: { $exists: false } },
            { $set: { company: defaultCompany._id } }
        );
        console.log(`Migrated ${usersResult.modifiedCount} users to default company.`);

        // 3. Migrate Projects
        const projectsResult = await Project.updateMany(
            { company: { $exists: false } },
            { $set: { company: defaultCompany._id } }
        );
        console.log(`Migrated ${projectsResult.modifiedCount} projects to default company.`);

        // 4. Migrate Tasks
        const tasksResult = await Task.updateMany(
            { company: { $exists: false } },
            { $set: { company: defaultCompany._id } }
        );
        console.log(`Migrated ${tasksResult.modifiedCount} tasks to default company.`);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();
