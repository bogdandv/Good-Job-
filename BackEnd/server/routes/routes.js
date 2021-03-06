const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Video = require('../models/video');
const Tag = require('../models/tag');
const RatingManager = require('../managers/ratingManager');




/*
  -------------------VIDEO STUFF---------------------
*/


//post a video
router.post('/upload', (req, res, next) => {
  let newVideo = {
    link: req.body.link,
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    username: req.body.username,
    rating: req.body.rating,
    class: req.body.class
  }
  console.log('the class is'+newVideo.class)

  Video.addVideo(new Video(newVideo), (err, video) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to upload video' });
    } 
    else {
      let conditions = {
        _id: video._id}
      let data = {
        voterId: newVideo.userId,
        rating: newVideo.rating,
        class: newVideo.class
      }
      RatingManager.rateVideo(conditions, data, (err2, result) => {
        if (err2) {
          console.log('Failed to rate video');
        } else {
           console.log('Video rated');
        }
      })
      res.json({ success: true, msg: 'Video saved' });
    }
  })
});

//rate a video
router.post('/rate', (req, res, next) => {
  let conditions = {
    _id: req.body._id
  }
  let data = {
    voterId: req.body.userId, 
    rating: req.body.rating
  }
  User.getClassById(data.voterId, (err, cls) => {
    data.class=cls.class;
    if (err) 
      res.json({ success: false, msg: 'Failed' });

    else {
      RatingManager.rateVideo(conditions, data, (err2, result) => {
        if (err2) {
          res.json({ success: false, msg: 'Failed to upload video', result: result });
        } else {
          console.log("rating indeed saved")
          res.json({ success: true, msg: 'Video saved', result: result });
        }
      })
    }
    
  });
})

//the the basic feed of videos
router.get('/feed', (req, res) => {
  const query = {
    sort: req.query.sort,
    select: req.query.select,
    limit: req.query.limit,
    skip: req.query.skip,
    from: req.query.from,
    to: req.query.to
  }

  Video.getVideos(query, (err, videos) => {
    if (err) throw err;
    if (!videos) {
      return res.json({ success: false, msg: 'Videos not found' });
    }
    videos.forEach(function (element) {
      //console.log(element);
    }, this);

    res.json({ success: true, videos: videos });
  })
});



// Search
router.post('/search', (req, res, next) => {
  /*Tag.addTag({name:'test1',videos:'NOTHING'});
  Tag.addTag({name:'test2',videos:'NOTHING2'});*/
  if (req.body.type == 'reqTags') {
    Tag.getAllTags((err, tags) => {
      res.json({ tags: tags });
    })

  }
});









/*
  -------------------USER STUFF---------------------
*/
// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    class: req.body.class
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      res.json({ success: true, msg: 'User registered' });
    }
  });
});


// Update User: Name
router.post('/updateName', (req, res, next) => {
  User.updateName({ id: req.body._id, name: req.body.name }, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to update name' });
    } else {
      res.json({ success: true, msg: 'Name updated' });
    }
  });
});

// Update User: Email
router.post('/updateEmail', (req, res, next) => {
  User.updateEmail({ id: req.body._id, email: req.body.email }, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to update e-mail' });
    } else {
      res.json({ success: true, msg: 'E-mail updated' });
    }
  });
});

// Update User: Password
router.post('/updatePassword', (req, res, next) => {
  User.getUserById(req.body._id, (err, user) => {
    if (err) throw err;
    if (!user) {
      console.log('aici');
      return res.json({ success: false, msg: 'User not found' });
    }

    User.comparePassword(req.body.oldPassword, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {

        User.updatePassword({ id: req.body._id, password: req.body.password }, (err, user) => {
          if (err) {
            res.json({ success: false, msg: 'Failed to update password' });
          } else {
            res.json({ success: true, msg: 'Password updated' });
          }
        });

      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      } 
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user });
});


router.get('/viewprofile', (req, res, next) => {
  User.getUserByUsername(req.username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

  });
});


router.get('/userprofile', (req, res) => {//searches for the user by his username

  User.getUserByUsername(req.query.username, (err, user) => {

    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    res.json({ success: true, user: user });
  })
});

router.get('/userprofilebyemail', (req, res) => {

  User.getUserByEmail(req.query.email, (err, user) => {

    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    res.json({ success: true, user: user });

  })
});

module.exports = router;
