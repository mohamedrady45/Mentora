const mongoose = require('mongoose');
const Post = require('../Models/post').Post;
const Comment = require('../Models/post').Comment;
const Reply = require('../Models/post').Reply;
const Share = require('../Models/post').Share;
const User = require('../Models/user');
const upload = require("../middlewares/uploadFile");
const path = require("path");
const fs = require("fs");

//get all posts
const getAllPosts = async (req, res) => {
    try {
      const userId =req.userId;
      const posts = await Post.find({author:userId}).populate('author');
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
//create post
const addPost = async (req, res, next) => {
    try{
        const files = req.files;
        const author = req.userId;
        const { content } = req.body;

        // Create a new post instance
        const newPost = new Post({
            author: author, 
            content: content,
            attachments: files.map(file => ({ 
                type: file.mimetype.split('/')[0], 
                url: file.path // Store the file path as the URL (you may need to adjust this based on your file storage setup)
            }))
        });

        await newPost.save();
        res.status(200).json({ message: 'Your post was shared.' });
    }
    catch(err){ 
        console.error('Error creating post.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

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
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    }
};

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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//react post
const reactPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }

      //Check if the user has already reacted to the post
      let userReacted = post.reacts.users.includes(req.userId);
      if (! userReacted) {
        // User has not reacted, allow reacting to the post
        post.reacts.count += 1;
        post.reacts.users.push(req.userId);
        userReacted = true;
        res.status(200).json({message:'You liked the post.'})
      } else {
        // User has already reacted, allow disliking the post
        post.reacts.count -= 1;
        post.reacts.users.pull(req.userId);
        userReacted = false;
        res.status(200).json({message:'You disliked the post.'})
      }

      await post.save();
      
      res.status(200).json({ message: 'Your post was reacted.' });

    } catch (err) {
      console.error("Error reacting post.", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

//add comment
const addComment  = async (req,res,next)=>{
    try{    
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'This post does not exist' });
        }
        const files = req.files;
        const author = req.userId;
        const  { content } = req.body;

        const newComment = new  Comment ({
            author: author,
            content:content,
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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

//update comment
const updateComment = async (req, res, next) => {
    try{
        // Find the post to which the comment belongs
        const comment = await Comment.findById(req.params.id);
        await comment.updateOne({$set:req.body});
        res.status(200).json({message:'The comment has been successfully updated'})
    }
    catch(err){
        console.error('Error updating post.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    }
};

//delete comment
const deleteComment = async (req, res, next) => {
    try{
        // Find the post to which the comment belongs
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        //find the id of the comment to be deleted
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        post.comments.pull(comment);
        await comment.deleteOne();
        await post.save();
        res.status(200).json({message:'Your comment has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//react for a comment
const reactComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }

      //Check if the user has already reacted to the comment
      let userReacted = comment.reacts.users.includes(req.userId);
      if (! userReacted) {
        // User has not reacted, allow reacting to the comment
        comment.reacts.count += 1;
        comment.reacts.users.push(req.userId);
        userReacted = true;
        res.status(200).json({message:'You liked the comment.'});
      } else {
        // User has already reacted, allow disliking the comment
        comment.reacts.count -= 1;
        comment.reacts.users = comment.reacts.users.pull(req.userId);
        userReacted = false;
        res.status(200).json({message:'You disliked the comment.'});
      }

      await comment.save();

      res.status(200).json({ message: 'Your comment was reacted.' });

    } catch (err) {
        console.error("Error reacting comment.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//reply for a comment
const replyComment  = async (req,res,next)=>{
    try{   
        // Find the post to which the comment belongs
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }
        const  files = req.files;
        const author = req.userId;
        const { content } = req.body;

        const  reply = new Reply ({
            author: author,
            content: content,
            attachments: files.map(file => ({
                type: file.mimetype.split('/')[0], 
                url: file.path
            }))
        });
        comment.replies = comment.replies || []; // Initialize replies if it doesn't exist

        comment.replies.push(reply);
        comment.count += 1;
        
        await reply.save(); 
        await comment.save();  
        await post.save();
        res.status(200).json({ message: 'Your reply was shared.' });

    } catch (err) {
      console.error("Error reply in the  post.", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};

//react for a reply
const reactReply = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'This comment does not exist' });
        }

        const reply = await Reply.findById(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ error: 'This reply does not exist' });
        }

      //Check if the user has already reacted to the comment
      let userReacted = reply.reacts.users.includes(req.userId);
      if (! userReacted) {
        // User has not reacted, allow reacting to the comment
        reply.reacts.count += 1;
        reply.reacts.users.push(req.userId);
        userReacted = true;
        res.status(200).json({message:'You liked the comment.'});
      } else {
        // User has already reacted, allow disliking the comment
        reply.reacts.count -= 1;
        reply.reacts.users = reply.reacts.users.pull(req.userId);
        userReacted = false;
        res.status(200).json({message:'You disliked the comment.'});
      }

      await reply.save();
      await comment.save();
      res.status(200).json({ message: 'Your comment was reacted.' });

    } catch (err) {
        console.error("Error reacting comment.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//delete reply
const deleteRely = async (req, res, next) => {
    try{
        
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const reply = await Reply.findById(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }
        
        comment.replies.pull(reply);
        await reply.deleteOne();
        await comment.save();
        res.status(200).json({message:'Your comment has been successfully deleted.'})
    }
    catch(err){
      console.error('Error deleting post.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//save post
const savePosts = async (req, res, next) => {
    try {
        // Find the user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the post
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the post is already saved by the user
        const isSavedIndex = user.savePosts.indexOf(req.params.id);
        const isSaved = isSavedIndex !== -1;

        if (!isSaved) {
            // Save the post
            user.savePosts.push(req.params.id);
            await user.save();
            return res.status(200).json({ message: 'You saved the post.' });
        } else {
            // Unsave the post
            user.savePosts.splice(isSavedIndex, 1);
            await user.save();
            return res.status(200).json({ message: 'You unsaved the post.' });
        }
    } catch (err) {
        console.error("Error saving the post:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


//share post
const  sharePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const sharedPost = new Post({
            author: req.userId, 
            content: post.content,   
          });
      
          // Initialize shares if it doesn't exist
          post.shares = post.shares || {}; 
          post.shares.count = post.shares.count || 0;

          post.shares.users = post.shares.users || []; // Initialize users array if it doesn't exist
          post.shares.count += 1;
          post.shares.users.push(req.userId);
         
          await sharedPost.save();
          await post.save();

        res.status(200).json({ message: 'You shared the post.' });

    }catch(err){
        console.error("Error sharing the  post.", err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


module.exports = {
    addPost,
    updatePost,
    deletePost,
    getAllPosts,
    reactPost,
    addComment,
    updateComment,
    deleteComment,
    reactComment,
    replyComment,
    reactReply,
    deleteRely,
    savePosts,
    sharePost,
  };