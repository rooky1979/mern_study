const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
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
  (req, res) => {
    //variable to check the request
    const errors = validationResult(req);
    //if the errors are not empty, return a 400 (bad request) with the error message
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('User route');
  }
);

module.exports = router;
