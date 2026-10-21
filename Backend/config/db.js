const mongoose = require('mongoose');
const seedDemoUsers = require('./seedData');

const connectDB = async () => {
    let connected = false;
    const uri = process.env.MONGO_URI;

    // Try connecting to configured MongoDB (if specified and not default placeholder)
    if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
        try {
            console.log(`Connecting to MongoDB at ${uri}...`);
            const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            connected = true;
        } catch (error) {
            console.warn(`Could not connect to external MongoDB: ${error.message}`);
        }
    }

    // Fall back to in-memory MongoDB if external connection is unavailable
    if (!connected) {
        try {
            console.log('Starting in-memory MongoDB development server...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`MongoDB Connected (In-Memory Development Server): ${conn.connection.host}`);
            connected = true;
        } catch (memError) {
            console.error(`Error starting in-memory MongoDB: ${memError.message}`);
            process.exit(1);
        }
    }

    // Seed demo accounts if database is empty
    await seedDemoUsers();
};

module.exports = connectDB;

