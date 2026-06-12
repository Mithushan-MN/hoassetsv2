const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const seedData = require('./seedData.json');

dotenv.config();

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assetshointernal');
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    console.log('Previous data cleared.');

    // We can insert the enriched seedData directly since it matches our schema
    await Product.insertMany(seedData);
    
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
