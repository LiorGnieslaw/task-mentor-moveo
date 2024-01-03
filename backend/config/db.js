const mongoose = require('mongoose');
const uri = "mongodb+srv://liorgni4:Lg123456@cluster0.wjhic2b.mongodb.net/sample_training?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
