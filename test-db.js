import connectDB from './config/db.js';

const testConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await connectDB();
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();