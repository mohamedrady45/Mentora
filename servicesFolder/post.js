
const Post = require('../Models/post').Post;

const getUserPosts = async (search, popu) => {
    try {
        const posts = await Post.find(search).populate(popu).sort({ createdAt: -1 });;
        return posts;
    }
    catch(err){
        console.log('can\'t get posts');
    }
}

module.exports = {
    getUserPosts,
}