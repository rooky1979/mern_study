const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/Users');

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
  '/',
  [
    //second parameter of POST is for validator in '[ ]' brackets to check the name, email and password length
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please add a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //variable to check the request
    const errors = validationResult(req);
    //if the errors are not empty, return a 400 (bad request) with the error message
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //see if user exists and not email duplicate
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg', //rating of pic
        d: 'mm', //default is just a plain nobody
      });
      //create new instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //encrypt password
      //create a salt with bcrypt
      const salt = await bcrypt.genSalt(10); //A salt is a random string that makes the hash unpredictable.

      user.password = await bcrypt.hash(password, salt);
      //Save user in Mongo
      await user.save();

      //return jsonwebtoken
      //payload object
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
