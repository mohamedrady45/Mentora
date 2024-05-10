const userService = require('../services/user')
const postService = require('../Services/post')
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
    const posts= await postService.getUserPosts({author:userId},{path:'author',select:'firstName lastName profilePicture'});

    //create user data
    const userData = {
      _id: user._id,
      name: user.firstName +" " + user.lastName,
      email: user.email,
      dateOfBirth:user.dateOfBirth,
      country:user.country,
      gender:user.gender,
      profilePicture:user.profilePicture,
      languages:user.languages,
      interests:user.interests,
      posts:posts
    }

    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    next(err);
  }
};

module.exports = {
  getUser,
}