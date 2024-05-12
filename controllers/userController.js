const userService = require('../services/user')
const postService = require('../Services/post')
const User = require('../Models/user')
const getUser = async (req, res, next) => {
  try {
    //take data 
    const userId = req.userId;
    //find user
    const user = await userService.findUser({ _id: userId })
    //if user not found
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

const editUserData = async (req, res, next) => {
  try {
    //take data 
    const userId = req.userId;

    let { bio, languages, interests, country } = req.body;
    const file = req.file;
    console.log(req.body, file)

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


    languages = languages.split(',');
    languages.forEach(lang => {
      user.languages.push(lang);
    });

    interests = interests.split(',');
    interests.forEach(interest => {
      user.interests.push(interest);
    });
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
      })}

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
    //save user
    await user.save()
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


module.exports = {
  getUser,
  editUserData,
  followUser
}