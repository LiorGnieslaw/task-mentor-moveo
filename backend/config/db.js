const mongoose = require('mongoose');
const uri = "mongodb+srv://liorgni4:Lg123456@cluster0.wjhic2b.mongodb.net/sample_training?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    console.log('trying yo connect mongo')
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log('fuckkk')
    process.exit(1);
  }
};

module.exports = connectDB;
