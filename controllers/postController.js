const mongoose = require('mongoose');
const Post = require('../Models/post').Post;
const Comment = require('../Models/post').Comment;
const Reply = require('../Models/post').Reply;
const Share = require('../Models/post').Share;
const User = require('../Models/user');
//const cloudinary = require('../Services/cloudinary');
const upload = require("../middlewares/uploadFile");

//create post
const addPost = async (req, res, next) => {
    try{
        const files = req.files;
        const { author, content } = req.body;

        // Create a new post instance
        const newPost = new Post({
            author: author, 
            content: content,
            attachments: files.map(file => ({ 
                type: file.mimetype.split('/')[0], 
                url: file.path // Store the file path as the URL (you may need to adjust this based on your file storage setup)
            }))
        });

        const savedPost = await newPost.save();
        res.status(200).json({ message: 'Your post was shared.' });
    }
    catch(err){ 
        console.error('Error creating post.', err);
        next(err);
    }
}

//update post
const updatePost = async (req, res, next) => {
    try{
        //find the id of the post to be updated
        const post = await Post.findById(req.params.id);
        await post.updateOne({$set:req.body});

        res.status(200).json({message:'The post has been successfully updated'})
    }
    catch(err){
        console.error('Error updating post.', err);
        next(err);  
    }
}

//delete post
const deletePost = async (req, res, next) => {
    try{
        //find the id of the post to be deleted
        const post = await Post.findById(req.params.id);
        await post.deleteOne();
        res.status(200).json({message:'The post has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      next(err);  
    }
}

//react post
const reactPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new Error('This post does not exist');
        }

      //Check if the user has already reacted to the post
      let userReacted = post.reacts.users.includes(req.body.author);
      if (! userReacted) {
        // User has not reacted, allow reacting to the post
        post.reacts.count += 1;
        post.reacts.users.push(req.body.author);
        userReacted = true;
        res.status(200).json({message:'You liked the post.'})
      } else {
        // User has already reacted, allow disliking the post
        post.reacts.count -= 1;
        post.reacts.users.pull(req.body.author);
        userReacted = false;
        res.status(200).json({message:'You disliked the post.'})
      }

      const savedPost = await post.save();
      
      res.status(200).json({ message: 'Your post was reacted.' });

    } catch (err) {
      console.error("Error reacting post.", err);
      next(err);
    }
};

//add comment
const addComment  = async (req,res,next)=>{
    try{    
        const post = await Post.findById(req.params.id);
        if (!post) {
            throw new Error('This post does not exist');
        }
        const files = req.files;
        const  {author, content} = req.body;

        const newComment = new  Comment ({
            author: author,
            content:content,
            dateCreated : Date.now(),
            attachments: files.map(file => ({
                type: file.mimetype.split('/')[0], 
                url: file.path
            }))
        });
        post.comments.push(newComment);
        await post.save(); 
        await newComment.save();
        res.status(200).json({ message: 'Your comment was shared.' });

    } catch (err) {
      console.error("Error comment in the  post.", err);
      next(err);
    }
};

const deleteComment = async (req, res, next) => {
    try{
        //find the id of the post to be deleted
        const comment = await Comment.findById(req.params.id);
        await comment.deleteOne();
        res.status(200).json({message:'Your comment has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      next(err);  
    }
}
//react for a comment
const reactComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            throw new Error('This comment does not exist');
        }

      //Check if the user has already reacted to the comment
      let userReacted = comment.reacts.users.includes(req.body.author);
      if (! userReacted) {
        // User has not reacted, allow reacting to the comment
        comment.reacts.count += 1;
        comment.reacts.users.push(req.body.author);
        userReacted = true;
        res.status(200).json({message:'You liked the comment.'});
      } else {
        // User has already reacted, allow disliking the comment
        comment.reacts.count -= 1;
        comment.reacts.users = comment.reacts.users.pull(req.body.author);
        userReacted = false;
        res.status(200).json({message:'You disliked the comment.'});
      }

      const savedComment = await comment.save();

      res.status(200).json({ message: 'Your comment was reacted.' });

    } catch (err) {
        console.error("Error reacting comment.", err);
        next(err);
    }
};

//reply for a comment
const replyComment  = async (req,res,next)=>{
    try{    
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            throw new Error('This comment does not exist');
        }

        const  reply = new Reply (req.body);

        comment.replies = comment.replies || {}; // Initialize replies if it doesn't exist
        
        comment.replies.push(reply);
        await reply.save(); 
        await comment.save();  
        
        res.status(200).json({ message: 'Your reply was shared.' });

    } catch (err) {
      console.error("Error reply in the  post.", err);
      next(err);
    }
};

//save post
const savedPosts = async(req, res, next) =>{
    try{
        const user = await User.findById(req.body);
        if (!user) {
            throw new Error('User not found');
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            throw new Error('Post not found');
        }

        //Check if the user has already saved the post
        const isSaved = User.savedPosts.includes(req.params.id);
        if (isSaved) {
            user.savedPosts.push(req.params.id);
            await user.save();
            res.status(200).json({ message: 'You saved the post.' });
        } else{
            // Remove the post ID from savedPosts to unsave it
            user.savedPosts = user.savedPosts.filter((postId) => postId !== req.params.id);
            await user.save();
            res.status(200).json({ message: 'You unsaved the post.' });
        }
        
    } catch(err){
        console.error("Error saving the  post.", err);
        next(err);
    }
}; 

//share post
const  sharePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            throw new Error('Post not found');
        }

        const sharedPost = new Post({
            author: req.body.author, 
            content: post.content,   
          });
      
          // Initialize shares if it doesn't exist
          post.shares = post.shares || {}; 
          post.shares.count = post.shares.count || 0;

          post.shares.count += 1;
          post.shares.users.push(req.body.author);
        
          //
          await sharedPost.save();
          await post.save();

        res.status(200).json({ message: 'You shared the post.' });

    }catch(err){
        console.error("Error sharing the  post.", err);
        next(err);
    }
};


module.exports = {
    addPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
    reactPost,
    reactComment,
    replyComment,
    savedPosts,
    sharePost,
  };