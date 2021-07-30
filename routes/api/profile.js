const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const Post = require('../../models/Post');

//@route    GET api/profile/me
//@desc     get current user's profile
//@access   Private
router.get('/me', auth, async (req, res) => {
  try {
    //variable for finding the current profile
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    //error if the profile does not exist
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    //else respond with the profile
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    POST api/profile
//@desc     create or update user profile
//@access   Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
      //create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }

    console.log(profileFields.social.twitter);
    res.send('Hello');
  }
);

//@route    GET api/profile
//@desc     get all profiles
//@access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/profile/user/:user_id
//@desc     get profile by user id
//@access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json('Profile not found');

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json('Profile not found');
    }
    res.status(500).send('Server Error');
  }
});

//@route    DELETE api/profile
//@desc     Delete profile,user and posts
//@access   Private
router.delete('/', auth, async (req, res) => {
  try {
    //remove user posts
    await Post.deleteMany({ user: req.user.id });

    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/profile/experience
//@desc     add profile experience
//@access   Private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //applicable fields are pulled out of the text body
    const { title, company, location, from, to, current, description } =
      req.body;
    //new experience object is declared and assigned from the req above
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    // the profile by user ID is found
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // new experience is pushed onto the experience array of the profile
      profile.experience.unshift(newExp);
      //saved to the DB
      await profile.save();
      //response with the profile to the screen
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
//@route    DELETE api/profile/experience/:exp_id
//@desc     delete profile experience
//@access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    //splice overwrites the array. splice(index, howMany, "items added...")
    profile.experience.splice(removeIndex, 1);
    //save
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/profile/education
//@desc     add profile education
//@access   Private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //applicable fields are pulled out of the text body
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    //new education object is declared and assigned from the req above
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    // the profile by user ID is found
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // new education is pushed onto the experience array of the profile
      profile.education.unshift(newEdu);
      //saved to the DB
      await profile.save();
      //response with the profile to the screen
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
//@route    DELETE api/profile/education/:edu_id
//@desc     delete profile education
//@access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    //splice overwrites the array. splice(index, howMany, "items added...")
    profile.education.splice(removeIndex, 1);
    //save
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/profile/github/:username
//@desc     get user repos from Github
//@access   Public

/* router.get('/github/:username', (req, res) => {
  try {
    //parameters for the request
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node-js' },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No GitHub profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}); */
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

module.exports = router;
