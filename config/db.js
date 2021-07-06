//bring in mongoose to connect
const mongoose = require('mongoose');

//grab the string from the config package
const config = require('config');

//get the config value
const db = config.get('mongoURI');

//async/await function to connect
const connectDB = async () => {
  //try to connect. Await because it returns a promise
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('MongoDB connected...');
    //if can't connect, show error message and break
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
//export the connectDB function
module.exports = connectDB;
