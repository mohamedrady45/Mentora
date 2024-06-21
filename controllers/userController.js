const userService = require('../services/user')
const postService = require('../services/post')
const User = require('../Models/user')
const Schadule = require('../Models/Schedule')

const getUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
    if (!user) {
      const err = new Error('Can\'t find user');
      err.statusCode = 404;
      throw err;
    }
    //FIXME: coments , react and share
    //get user posts
    const posts = await postService.getUserPosts({ author: userId }, { path: 'author', select: 'firstName lastName profilePicture' });

    //create user data
    const userData = {
      _id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      gender: user.gender,
      profilePicture: user.profilePicture,
      languages: user.languages,
      interests: user.interests,
      posts: posts
    }

    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (err) {
    console.error('Error in get this User:', err);
    next(err);
  }
};
const searchUser = async (req, res, next) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

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
      .skip(skip)
      .limit(limit)
      .select('firstName lastName role country bio profilePicture');

    const count = await User.countDocuments(searchCriteria);

    const results = users.map(user => ({
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      country: user.country,
      bio: user.bio,
      profilePicture: user.profilePicture
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
    //take data 
    const userId = req.userId;

    let { bio, languages, interests, country } = req.body;
    const file = req.file;


    //update user
    const user = await userService.findUser('_id', userId);
    //check if user exist
    if (!user) {
      throw new Error('User not found');
    }
    //update user data
    if (file) {
      user.profilePicture = file.path;
    }

    user.bio = bio;
    user.country = country;


    if (languages) {
      languages = languages.split(',');
      languages.forEach(lang => {
        user.languages.push(lang);
      });

    }
    if (interests) {
      interests = interests.split(',');
      interests.forEach(interest => {
        user.interests.push(interest);
      });
    }

    //save user
    await user.save()
    //send response
    res.status(200).json({
      success: true,
      data: {
        user: user
      }
    });
  } catch (err) {
    console.error('Error in update your data:', err);
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
    const schadule = await Schadule.find({ user: userId })
      .populate('createdBy', 'fristName lastName')
      .populate('from', 'name title');

    res.status(200).json({
      success: true,
      data: {
        schadule: schadule
      }
    });
  }
  catch (err) {
    console.error('Error in get your schadule:', err);
    next(err);
  }
}
module.exports = {
  getUser,
  editUserData,
  followUser,
  followerList,
  followingList,
  scheduleList,
  searchUser
}

