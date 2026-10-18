const mongoose = require('mongoose');

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI;
    const fallbackUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/careersync';

    try {
        const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Primary MongoDB connection failed: ${error.message}`);
        if (primaryUri && !primaryUri.includes('127.0.0.1') && !primaryUri.includes('localhost')) {
            console.log(`Attempting fallback to local MongoDB (${fallbackUri})...`);
            try {
                const fallbackConn = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 5000 });
                console.log(`Fallback MongoDB Connected: ${fallbackConn.connection.host}`);
                return;
            } catch (fallbackError) {
                console.error(`Fallback MongoDB connection failed: ${fallbackError.message}`);
            }
        }
        process.exit(1);
    }
};

module.exports = connectDB;
