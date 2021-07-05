//bring in express
const express = require('express');

//add the DB connection
const connectDB = require('./config/db.js');

//initialise app variable with express
const app = express();

//call the DB connection and connect
connectDB();

//Init middleware
app.use(express.json({extended: false}));

//single end point to test and send something to the browser
app.get('/', (req, res) => res.send('API running'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//looks for an environment variable in Heroku else runs locally on 5000
const PORT = process.env.PORT || 5000;

//app to listen on a port and server starts
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
