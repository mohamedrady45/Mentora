const userService = require('../services/user')
const postService = require('../services/post')
const User = require('../Models/user')
const Schedule = require('../Models/Schedule')
const cloudinary = require('../services/cloudinary')
const Post = require('../Models/post').Post;
const mongoose = require('mongoose');


const getAnotherUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('Invalid user ID');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('Can\'t find user');
      err.statusCode = 404;
      throw err;
    }

    // FIXME: comments, react and share
    // Get user posts
    const posts = await postService.getUserPosts({ author: userId }, { path: 'author', select: 'firstName lastName profilePicture' });

    // Create user data
    const userData = {
      _id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      gender: user.gender,
      profilePicture: user.profilePicture.url,
      languages: user.languages,
      interests: user.interests,
      posts: posts,
      bio: user.bio
    }

    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (err) {
    console.error('Error in getAnotherUserProfile:', err);
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.userId; 
    const user = await User.findById(userId);
    
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // FIXME: Fetch user's posts, comments, reacts, shares, etc.
     const posts = await Post.find({ author: userId }).populate('author', 'firstName lastName profilePicture');
    
    const userData = {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      gender: user.gender,
      profilePicture: user.profilePicture.url,
      languages: user.languages,
      interests: user.interests,
      posts: posts,
      bio: user.bio
    };

    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    next(err);
  }
};


const searchUser = async (req, res, next) => {
  const query = req.body;

  try {
    let searchCriteria;

    if (query) {
      const nameParts = query.split(' ').filter(Boolean);

      if (nameParts.length === 1) {
        searchCriteria = {
          $or: [
            { firstName: new RegExp(nameParts[0], 'i') },
            { lastName: new RegExp(nameParts[0], 'i') }
          ]
        };
      } else if (nameParts.length === 2) {
        searchCriteria = {
          $and: [
            { firstName: new RegExp(nameParts[0], 'i') },
            { lastName: new RegExp(nameParts[1], 'i') }
          ]
        };
      }
    }

    const users = await User.find(searchCriteria)
      .select('firstName lastName role country bio profilePicture');

    const count = await User.countDocuments(searchCriteria);

    const results = users.map(user => ({
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      country: user.country,
      bio: user.bio,
      profilePicture: user.profilePicture.url
    }));

    res.json({
      users: results,
      total: count,
      page,
      pages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const editUserData = async (req, res, next) => {
  try {
    const userId = req.userId;

    let { bio, languages, interests, country } = req.body;
    const file = req.file;
    console.log(file);

    const user = await userService.findUser('_id', userId);

    if (!user) {
      throw new Error('User not found');
    }

    let attachments = [];
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "Profile",
      });
      attachments.push({
        type: 'image',
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    if (attachments.length > 0) {
      user.profilePicture = attachments[0];
    }
    if (bio) user.bio = bio;
    if (country) user.country = country;

    if (languages) {
      languages = languages.split(',');
      user.languages = languages;
    }
    if (interests) {
      interests = interests.split(',');
      user.interests = interests;
    }

    await user.save();

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      gender: user.gender, 
      bio: user.bio,
      profilePicture: user.profilePicture.url,
      languages: user.languages,
      interests: user.interests,
      notification: user.notification,
      followers: user.followers,
      following: user.following, 
    };

    res.status(200).json({
      success: true,
      data: {
        user: userData,
      },
    });
  } catch (err) {
    console.error('Error in updating user data:', err);
    next(err);
  }
};


const followUser = async (req, res, next) => {
  try {
    //take data 
    const userId = req.userId;
    const { followId } = req.params;

    //find user
    const user = await userService.findUser('_id', userId);
    //follow user
    const follow = await userService.findUser('_id', followId);
    //check if user exist
    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'this user dose not exist'
      })
    }

    let msg;

    //check if user is already following
    if (!user.following.userIds.includes(followId)) {
      //push user id to following array
      user.following.counter++;
      user.following.userIds.push(followId);

      //push user id to followers array
      follow.followers.counter++;
      follow.followers.userIds.push(userId);
      msg = `You are follow ${follow.firstName} now`;
    }
    else {
      user.following.counter--;
      user.following.userIds.pull(followId);

      follow.followers.counter--;
      follow.followers.userIds.pull(userId);
      msg = `You are unfollow ${follow.firstName} now`;
    }
    console.log(follow.followers.userIds)
    //save user
    await user.save();
    await follow.save();
    //send response
    res.status(200).json({
      success: true,
      data: {
        msg: msg
      }
    });
  } catch (err) {
    console.error('Error in update your data:', err);
    next(err);
  }
};
const followerList = async (req, res, next) => {
  try {
    //take data 
    const userId = req.userId;
    //find user
    const user = await userService.findUser('_id', userId, 'followers.userIds', 'firstName lastName profilePicture');
    //followers
    const followers = user.followers.userIds;

    //send response
    res.status(200).json({
      success: true,
      data: {
        Followers: followers
      }
    });
  } catch (err) {
    console.error('Error in get your followers list:', err);
    next(err);
  }
}

const followingList = async (req, res, next) => {
  try {
    //take data 
    const userId = req.userId;
    //find user
    const user = await userService.findUser('_id', userId, 'following.userIds', 'firstName lastName profilePicture');
    //followers
    const following = user.following.userIds;

    //send response
    res.status(200).json({
      success: true,
      data: {
        Following: following
      }
    });
  } catch (err) {
    console.error('Error in get your following list:', err);
    next(err);
  }
}
const scheduleList = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log(user);
    const schedule = await Schedule.find({ user: userId })
      .populate('createdBy', 'firstName lastName')
      .populate({
        path: 'from',
        select: 'name title', 
      });

    res.status(200).json({
      success: true,
      data: schedule.map(s => ({
        title: s.title,
        from: s.from.name, 
        date: s.date,
        meetingLink: s.meetingLink
      }))
    });
  } catch (err) {
    console.error('Error in get your schedule:', err);
    next(err);
  }
}

module.exports = {
  getAnotherUserProfile,
  editUserData,
  followUser,
  followerList,
  followingList,
  scheduleList,
  searchUser,
  getMyProfile
}

