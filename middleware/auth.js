const jwt = require('jsonwebtoken');
const config = require('config');

//middleware is something that has access to request and response objects. Next is a callback that runs so it moves on to the next piece of middleware
module.exports = function (req, res, next) {
  //get token from the header
  const token = req.header('x-auth-token');

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorisation denied' });
  }
  //verify the token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
