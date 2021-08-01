//bring in express
const express = require('express');

//add the DB connection
const connectDB = require('./config/db.js');

//path module to manipulate file paths
const path = require('path');

//initialise app variable with express
const app = express();

//call the DB connection and connect
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//serve static assets in production MAKE SURE THIS IS UNDERNEATH THE API ROUTES AND NOT ABOVE
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//looks for an environment variable in Heroku else runs locally on 5000
const PORT = process.env.PORT || 5000;

//app to listen on a port and server starts
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
