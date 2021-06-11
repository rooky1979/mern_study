//bring in express
const express = require('express');

//initialise app variable with express
const app = express();

//single end point to test and send something to the browser
app.get('/', (req, res) => res.send('API running'));

//looks for an environment variable in Heroku else runs locally on 5000
const PORT = process.env.PORT || 5000;

//app to listen on a port and server starts
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
